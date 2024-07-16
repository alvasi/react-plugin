# Install transformers from source - only needed for versions <= v4.34
# pip install git+https://github.com/huggingface/transformers.git
# pip install accelerate

import sys
import torch
from transformers import pipeline

try:
    user_message = sys.argv[1] if len(sys.argv) > 1 else "I want a smart contract for ERC20 token."

    pipe = pipeline("text-generation", model="HuggingFaceH4/zephyr-7b-beta", torch_dtype=torch.bfloat16, device_map="auto")

    # We use the tokenizer's chat template to format each message - see https://huggingface.co/docs/transformers/main/en/chat_templating
    messages = [
        {
            "role": "system",
            "content": "You are a useful assistant that recommends solidity smart contract templates based on the user's prompt",
        },
        {"role": "user", "content": user_message},
    ]
    prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    outputs = pipe(prompt, max_new_tokens=500, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
    print(outputs[0]["generated_text"])
except Exception as e:
    print(e, file=sys.stderr)
    sys.exit(1)