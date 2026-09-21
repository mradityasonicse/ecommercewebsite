---
name: winning-app-ml-processing
description: >-
  Deploys and optimizes machine learning architectures (PyTorch, ONNX, Transformers) and real-time streaming data pipelines (speech processing, audio signals, live telemetry) without server bottlenecks.
---

# Winning Application Machine Learning & Advanced Processing

This skill specifies procedures for deploying, serving, and optimizing machine learning models (PyTorch, ONNX, Hugging Face) and handling real-time, compute-heavy streaming tasks (speech signal processing, live audio, sensor telemetry) cleanly within production architectures.

---

## 1. Model Integration & Backend Serving

### Architectural Blueprint
- **Decoupled Model Runtime**:
  - Never load heavy weights or instantiate deep neural nets inside standard request handlers.
  - Load model weights into memory at application startup (FastAPI lifespan context manager or singleton model registry).
  - Use `torch.inference_mode()` (or `torch.no_grad()`) and `model.eval()` to eliminate computational overhead and autograd graph memory leaks.
- **Serialization & Runtime Acceleration**:
  - Export PyTorch models to **ONNX** or **TorchScript** for faster inference on CPU/GPU runtimes (ONNX Runtime, TensorRT).
  - Apply quantization (INT8/FP16) where appropriate to cut memory footprint and latency by 2x–4x with minimal accuracy loss.
- **Dynamic Batching & Queue Management**:
  - When traffic spikes, group concurrent single inference requests into dynamic mini-batches before feeding the tensor forward pass.
  - Set strict inference timeouts and worker health checks.

```python
from contextlib import asynccontextmanager
import torch
from fastapi import FastAPI

class ModelServer:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None

    def load(self, weights_path: str):
        # Load weights once during startup
        self.model = torch.load(weights_path, map_location=self.device)
        self.model.eval()

    @torch.inference_mode()
    def predict(self, input_tensor: torch.Tensor):
        input_tensor = input_tensor.to(self.device)
        output = self.model(input_tensor)
        return output.cpu().numpy()

model_server = ModelServer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load model into memory
    model_server.load("models/optimized_weights.pt")
    yield
    # Cleanup on shutdown
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

app = FastAPI(lifespan=lifespan)
```

---

## 2. Real-Time Data & Speech Signal Processing

### Non-Blocking Pipeline Design
- **Stream Buffering & Windowing**:
  - For continuous audio, voice, or sensor feeds, collect incoming binary frames into sliding time-window buffers (e.g., 20ms–50ms chunks, 16kHz sampling rate).
  - Perform Fourier Transforms (FFT), MFCC extraction, or spectrographic conversion using optimized C-extensions (NumPy, SciPy, Librosa) in dedicated thread pools (`concurrent.futures.ThreadPoolExecutor`).
- **WebSocket / WebRTC Audio Streaming**:
  - Stream chunks bi-directionally over WebSockets to provide instant auditory/visual feedback.
  - Implement backpressure controls: drop non-essential intermediate telemetry frames if network congestion is detected, prioritizing audio packet ordering and inference fidelity.
- **Worker Isolation**:
  - Separate high-throughput ingestion servers from heavy ML inference servers to guarantee the main web API never drops connections during heavy compute cycles.
