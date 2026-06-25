
/*
  Langchain Standard Response
*/


/*
{
  messages: [
    HumanMessage {
      "id": "8ed52aa0-0e19-4ed0-8116-9dd23efd4d78",
      "content": "What is weather in raipur ?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "chatcmpl-DxBmE94Sq3pReofSyvjx8cad8NV1v",
      "content": "",
      "name": "model",
      "additional_kwargs": {
        "tool_calls": [
          {
            "id": "call_IzBopmBYFn8GNhIliqD8cGnn",
            "type": "function",
            "function": "[Object]"
          }
        ]
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 60,
          "completionTokens": 15,
          "totalTokens": 75
        },
        "finish_reason": "tool_calls",
        "model_provider": "openai",
        "model_name": "gpt-4o-2024-08-06",
        "usage": {
          "prompt_tokens": 60,
          "completion_tokens": 15,
          "total_tokens": 75,
          "prompt_tokens_details": {
            "cached_tokens": 0,
            "audio_tokens": 0
          },
          "completion_tokens_details": {
            "reasoning_tokens": 0,
            "audio_tokens": 0,
            "accepted_prediction_tokens": 0,
            "rejected_prediction_tokens": 0
          }
        },
        "system_fingerprint": "fp_ccaab42819"
      },
      "tool_calls": [
        {
          "name": "get_weather",
          "args": {
            "city": "raipur"
          },
          "type": "tool_call",
          "id": "call_IzBopmBYFn8GNhIliqD8cGnn"
        }
      ],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "output_tokens": 15,
        "input_tokens": 60,
        "total_tokens": 75,
        "input_token_details": {
          "audio": 0,
          "cache_read": 0
        },
        "output_token_details": {
          "audio": 0,
          "reasoning": 0
        }
      }
    },
    ToolMessage {
      "id": "6651c43b-8dc3-4343-bb89-d87c2ee95c13",
      "content": "It's always sunny in raipur",
      "name": "get_weather",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "call_IzBopmBYFn8GNhIliqD8cGnn"
    },
    AIMessage {
      "id": "chatcmpl-DxBmGe9hoz2Zxlw1kUCJwEHwobNDf",
      "content": "The weather in Raipur is currently sunny.",
      "name": "model",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 90,
          "completionTokens": 10,
          "totalTokens": 100
        },
        "finish_reason": "stop",
        "model_provider": "openai",
        "model_name": "gpt-4o-2024-08-06",
        "usage": {
          "prompt_tokens": 90,
          "completion_tokens": 10,
          "total_tokens": 100,
          "prompt_tokens_details": {
            "cached_tokens": 0,
            "audio_tokens": 0
          },
          "completion_tokens_details": {
            "reasoning_tokens": 0,
            "audio_tokens": 0,
            "accepted_prediction_tokens": 0,
            "rejected_prediction_tokens": 0
          }
        },
        "system_fingerprint": "fp_ccaab42819"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "output_tokens": 10,
        "input_tokens": 90,
        "total_tokens": 100,
        "input_token_details": {
          "audio": 0,
          "cache_read": 0
        },
        "output_token_details": {
          "audio": 0,
          "reasoning": 0
        }
      }
    }
  ]
}

*/