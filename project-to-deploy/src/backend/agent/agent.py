from __future__ import annotations

import os
from pathlib import Path
from typing import Annotated

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from typing_extensions import TypedDict

from src.backend.agent.tools.tools import (
    lookup_specialty_info,
    look_up_doctors_by_department,
    look_up_free_schedule,
    book_appointment,
)

load_dotenv(Path(__file__).resolve().parents[3] / ".env")

SYSTEM_PROMPT_PATH = Path(__file__).resolve().parent / "system_prompt.txt"
SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]


TOOLS = [
    lookup_specialty_info,
    look_up_doctors_by_department,
    look_up_free_schedule,
    book_appointment,
]

LLM = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"), temperature=0)
LLM_WITH_TOOLS = LLM.bind_tools(TOOLS)


def _preview_text(content, max_length: int = 180) -> str:
    text = content if isinstance(content, str) else str(content)
    text = " ".join(text.split())
    if len(text) <= max_length:
        return text
    return text[: max_length - 3] + "..."


def _latest_human_text(messages: list) -> str | None:
    for message in reversed(messages):
        if isinstance(message, HumanMessage):
            return message.content if isinstance(message.content, str) else str(message.content)
    return None


def _fallback_response(user_text: str) -> str:
    """
    Fallback chỉ dùng 4 tool đã import.
    Không gọi tool nào ngoài lookup_specialty_info /
    look_up_doctors_by_department / look_up_free_schedule / book_appointment.
    """
    lowered = user_text.lower().strip()

    if not lowered:
        return (
            "Mình đang gặp sự cố kết nối với mô hình. "
            "Bạn hãy mô tả triệu chứng hoặc hỏi rõ như: "
            "“nên khám khoa nào?”, “bác sĩ khoa tim mạch”, "
            "“lịch trống bác sĩ X”, hoặc “đặt lịch khám”."
        )

    # Trường hợp hỏi khoa/chuyên khoa
    if any(token in lowered for token in ["khoa", "chuyên khoa", "chuyen khoa"]):
        specialty_hint = user_text
        for prefix in ["khoa ", "chuyên khoa ", "chuyen khoa "]:
            idx = lowered.find(prefix)
            if idx != -1:
                specialty_hint = user_text[idx + len(prefix):].strip(" ?")
                break

        try:
            return lookup_specialty_info.invoke({"specialty": specialty_hint})
        except Exception:
            return (
                "Mình chưa xử lý được yêu cầu lúc này. "
                "Bạn có thể nói rõ triệu chứng hoặc tên chuyên khoa bạn muốn khám."
            )

    # Trường hợp hỏi bác sĩ theo khoa
    if any(phrase in lowered for phrase in ["bác sĩ", "bac si", "doctor"]):
        try:
            return look_up_doctors_by_department.invoke({"query": user_text})
        except Exception:
            return (
                "Mình chưa tra cứu được danh sách bác sĩ lúc này. "
                "Bạn có thể cho mình tên khoa hoặc chuyên khoa cụ thể."
            )

    # Trường hợp hỏi lịch trống
    if any(phrase in lowered for phrase in ["lịch", "lich", "rảnh", "ranh", "trống", "trong", "schedule"]):
        try:
            return look_up_free_schedule.invoke({"query": user_text})
        except Exception:
            return (
                "Mình chưa tra được lịch trống lúc này. "
                "Bạn có thể gửi tên bác sĩ hoặc khoa cần khám."
            )

    # Trường hợp muốn đặt lịch
    if any(phrase in lowered for phrase in ["đặt lịch", "dat lich", "book", "appointment"]):
        return (
            "Để đặt lịch, bạn vui lòng cung cấp tên khoa hoặc bác sĩ, "
            "ngày giờ mong muốn, và thông tin cần thiết theo luồng đặt khám."
        )

    # Không cố gọi tool không tồn tại
    return (
        "Mình hiện chỉ hỗ trợ 4 tác vụ: tra chuyên khoa, tra bác sĩ theo khoa, "
        "xem lịch trống, và đặt lịch khám. Bạn có thể hỏi theo một trong các dạng đó."
    )


def agent_node(state: AgentState) -> AgentState:
    messages = state["messages"]

    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages

    try:
        response = LLM_WITH_TOOLS.invoke(messages)
    except Exception as exc:
        print(f"[Agent error] {type(exc).__name__}: {exc}")
        latest_human = _latest_human_text(messages) or ""
        response = AIMessage(content=_fallback_response(latest_human))

    if response.tool_calls:
        for tool_call in response.tool_calls:
            print(f"[Tool call] {tool_call['name']}({tool_call['args']})")
    else:
        print("[Agent] Trả lời trực tiếp")

    return {"messages": [response]}


def build_graph():
    builder = StateGraph(AgentState)
    builder.add_node("agent", agent_node)
    builder.add_node("tools", ToolNode(TOOLS))

    builder.add_edge(START, "agent")
    builder.add_conditional_edges("agent", tools_condition)
    builder.add_edge("tools", "agent")

    return builder.compile()


GRAPH = build_graph()


def run_turn(user_input: str, history: list | None = None, image_b64: str | None = None):
    current_history = history or []

    if image_b64:
        # image_b64 may be a full data URI (data:image/png;base64,...) or raw base64
        if image_b64.startswith("data:"):
            image_url = image_b64
        else:
            image_url = f"data:image/jpeg;base64,{image_b64}"
        content: list = [
            {"type": "text", "text": user_input or "Đây là ảnh triệu chứng của tôi."},
            {"type": "image_url", "image_url": {"url": image_url}},
        ]
        human_msg = HumanMessage(content=content)
    else:
        human_msg = HumanMessage(content=user_input)

    input_messages = current_history + [human_msg]
    result = GRAPH.invoke({"messages": input_messages})
    messages = result["messages"]
    all_messages = messages if isinstance(messages, list) else [messages]

    new_messages = all_messages[len(current_history) + 1:]
    for message in new_messages:
        if isinstance(message, ToolMessage):
            print(f"[Tool result] {_preview_text(message.content)}")

    return all_messages


def main() -> None:
    print("=" * 60)
    print("Vinmec Triage Assistant - Trợ lý định hướng chuyên khoa")
    print("Gõ 'quit' để thoát")
    print("=" * 60)

    history: list = []

    while True:
        user_input = input("\nBạn: ").strip()
        if user_input.lower() in {"quit", "exit", "q"}:
            break

        print("\n[Vinmec Triage Assistant đang suy nghĩ...]")
        history = run_turn(user_input, history)
        final_message = history[-1]
        print(f"\nVinmec Triage Assistant: {final_message.content}")


if __name__ == "__main__":
    main()