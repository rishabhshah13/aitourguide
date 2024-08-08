import time
import requests
import statistics
from typing import Dict, List, Tuple
from tqdm import tqdm
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Constants
BACKEND_URL = "http://localhost:8000/get_response"
NUM_REQUESTS = 10


def measure_latency(payload: Dict) -> Tuple[float, Dict]:
    """Measure the latency of a request to the backend."""
    try:
        start_time = time.time()
        response = requests.post(BACKEND_URL, json=payload, timeout=(5, 120))
        response.raise_for_status()
        end_time = time.time()
        return end_time - start_time, response.json()
    except requests.Timeout:
        print("Timeout error in measure_latency: Request took too long.")
        return float("inf"), {}
    except requests.ConnectionError:
        print("Connection error in measure_latency: Could not connect.")
        return float("inf"), {}
    except requests.RequestException as e:
        print(f"Error in measure_latency: {str(e)}")
        return float("inf"), {}


def load_test(payload: Dict, num_requests: int) -> List[float]:
    """Perform a load test on the backend."""
    latencies = []
    for _ in tqdm(range(num_requests), desc="Load Testing"):
        latency, _ = measure_latency(payload)
        if latency != float("inf"):
            latencies.append(latency)
        time.sleep(1)  # Delay to avoid overwhelming the server
    return latencies


def analyze_response_time_vs_length() -> List[Tuple[int, float]]:
    """Analyze response time vs input length."""
    results = []
    for length in range(10, 110, 10):
        payload = {"question": " ".join(["test"] * length), "model": "GPT4o"}
        input_length = length
        latency, _ = measure_latency(payload)
        if latency != float("inf"):
            results.append((input_length, latency))
        time.sleep(1)  # Delay to avoid overwhelming the server
    return results


def plot_latencies(latencies: List[float], file_path: str):
    """Plot and save a histogram of latencies."""
    plt.figure(figsize=(12, 6))
    sns.histplot(latencies, bins=30, kde=True, color="teal", edgecolor="black")
    plt.title("Latency Distribution", fontsize=16)
    plt.xlabel("Latency (seconds)", fontsize=14)
    plt.ylabel("Frequency", fontsize=14)
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.savefig(file_path)
    plt.close()


def plot_response_time_vs_length(data: List[Tuple[int, float]], file_path: str):
    """Plot and save a scatter plot of response time versus input length."""
    if data:
        lengths, times = zip(*data)
        plt.figure(figsize=(12, 6))
        sns.scatterplot(
            x=lengths, y=times, color="coral", edgecolor="black", s=100, alpha=0.7
        )
        plt.title("Response Time vs. Input Length", fontsize=16)
        plt.xlabel("Input Length (words)", fontsize=14)
        plt.ylabel("Response Time (seconds)", fontsize=14)
        plt.grid(True, linestyle="--", alpha=0.7)
        plt.savefig(file_path)
        plt.close()
    else:
        print("No data available to plot response time vs. input length.")


def visualize_results(
    latencies: List[float], response_time_vs_length: List[Tuple[int, float]]
):
    """Generate and save visualizations for latency distribution and response time vs input length."""
    assets_folder = "assets"
    os.makedirs(assets_folder, exist_ok=True)

    # Save latency distribution plot
    latency_file = os.path.join(assets_folder, "latency_distribution.png")
    if latencies:
        plot_latencies(latencies, latency_file)
    else:
        print("Insufficient data to generate latency distribution plot.")

    # Save response time vs input length plot
    response_time_file = os.path.join(assets_folder, "response_time_vs_length.png")
    if response_time_vs_length:
        plot_response_time_vs_length(response_time_vs_length, response_time_file)
    else:
        print("Insufficient data to generate response time vs input length plot.")


def main():
    """Main function for the evaluation script."""
    print("Starting evaluation...")

    # Define test payload
    payload = {"question": "How are you?", "model": "GPT4o"}

    # Latency Testing
    print("Measuring latency...")
    latency, _ = measure_latency(payload)
    print(f"Latency: {latency:.2f} seconds")

    # Load Testing
    print("Performing load test...")
    latencies = load_test(payload, NUM_REQUESTS)
    avg_latency = statistics.mean(latencies) if latencies else float("inf")
    print(f"Average Load Test Latency: {avg_latency:.2f} seconds")

    # Response Time vs Input Length Analysis
    print("Analyzing response time vs input length...")
    response_time_vs_length = analyze_response_time_vs_length()

    # Visualize results
    visualize_results(latencies, response_time_vs_length)

    print("Evaluation complete.")


if __name__ == "__main__":
    main()
