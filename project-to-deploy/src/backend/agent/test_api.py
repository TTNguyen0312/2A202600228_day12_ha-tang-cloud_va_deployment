﻿from __future__ import annotations

import os

from dotenv import load_dotenv

try:
    from src.be.agent import run_turn
    from src.be.tools.triage_tools import (
        check_emergency,
        lookup_specialty_info,
        suggest_specialties,
        triage_case,
    )
except ImportError:
    from agent import run_turn
    from src.be.tools.triage_tools import (
        check_emergency,
        lookup_specialty_info,
        suggest_specialties,
        triage_case,
    )


def print_block(title: str, content: str) -> None:
    print('=' * 60)
    print(title)
    print('=' * 60)
    print(content)
    print()


def run_tool_smoke_tests() -> None:
    print_block(
        'Emergency Check',
        check_emergency.invoke({'symptoms': 'Tôi đau ngực dữ dội và khó thở từ sáng'}),
    )
    print_block(
        'Structured Triage',
        triage_case.invoke(
            {
                'symptoms': 'Tôi đang ở nhà, đau bụng vùng thượng vị, buồn nôn và đầy hơi 2 ngày nay',
                'care_context': 'home',
                'turn_index': 1,
            }
        ),
    )
    print_block(
        'Specialty Suggestion',
        suggest_specialties.invoke({'symptoms': 'Tôi đau bụng, buồn nôn và đầy hơi 2 ngày nay'}),
    )
    print_block(
        'Specialty Lookup',
        lookup_specialty_info.invoke({'specialty': 'Thần kinh'}),
    )


def run_agent_smoke_test() -> None:
    if not os.getenv('OPENAI_API_KEY'):
        print('Bỏ qua test agent vì chưa có OPENAI_API_KEY.')
        return

    try:
        messages = run_turn('Tôi đau bụng, buồn nôn 2 ngày nay thì nên khám khoa nào?')
        print_block('Agent Reply', str(messages[-1].content))
    except Exception as exc:
        print(f'Không chạy được smoke test cho agent: {type(exc).__name__}: {exc}')


if __name__ == '__main__':
    load_dotenv()
    run_tool_smoke_tests()
    run_agent_smoke_test()
