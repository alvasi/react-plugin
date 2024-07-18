import sys
from gradio_client import Client

try:
    user_message = sys.argv[1] if len(sys.argv) > 1 else "I want a smart contract for ERC20 token."
    client = Client("alvasi/test")
    result = client.predict(
            message=user_message,
            system_message="You are a useful assistant that recommends a solidity smart contract template based on the user's prompt",
            max_tokens=512,
            temperature=0.7,
            top_p=0.95,
            api_name="/chat")
except Exception as e:
    print(e, file=sys.stderr)
    sys.exit(1)
print(result)

