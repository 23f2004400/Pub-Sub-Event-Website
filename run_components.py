#!/usr/bin/env python3

import subprocess
import sys
import time
import signal
import threading
from redis_client import RedisClient

def run_component(script_name, component_name):
    """Run a component and display its output with prefixes"""
    def output_reader(process, prefix):
        for line in iter(process.stdout.readline, ''):
            if line:
                print(f"[{prefix}] {line.rstrip()}")
    
    print(f"🚀 Starting {component_name}...")
    process = subprocess.Popen([
        sys.executable, script_name
    ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, 
       universal_newlines=True, bufsize=1)
    
    # Start thread to read output
    thread = threading.Thread(target=output_reader, args=(process, component_name))
    thread.daemon = True
    thread.start()
    
    return process, thread

def main():
    print("🎯 PUB/SUB EVENT PLANNING SYSTEM - MANUAL RUN")
    print("=" * 50)
    print("📋 This will start all components with labeled output")
    print("🔧 Make sure Redis is running on localhost:6379")
    print("📡 Uses Redis Streams for Pub/Sub messaging")
    print("=" * 50)
    
    # Check Redis connection
    try:
        redis_client = RedisClient()
        redis_client.redis.ping()
        print("✅ Redis connection successful!")
        redis_client.cleanup_streams()  # Clean up for fresh start
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("🔧 Please start Redis server and try again")
        sys.exit(1)
    
    processes = []
    
    def signal_handler(signum, frame):
        print("\n🛑 Shutting down all components...")
        for process, _ in processes:
            if process.poll() is None:
                process.terminate()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        # Start Coordinator
        coord_process, coord_thread = run_component("coordinator.py", "COORDINATOR")
        processes.append((coord_process, coord_thread))
        time.sleep(2)
        
        # Start Guests
        guests_process, guests_thread = run_component("event_guest.py", "GUESTS")
        processes.append((guests_process, guests_thread))
        time.sleep(3)
        
        # Start Host
        host_process, host_thread = run_component("event_host.py", "HOST")
        processes.append((host_process, host_thread))
        
        print("\n🔄 ALL COMPONENTS RUNNING!")
        print("=" * 30)
        print("👀 Watch the labeled output below to see the Pub/Sub flow:")
        print("   [COORDINATOR] - Message routing and summary generation")
        print("   [GUESTS] - Guest responses and decision making")
        print("   [HOST] - Invitation publishing and summary receiving")
        print("   📡 All communication via Redis Streams")
        print("=" * 30)
        print("⏹️  Press Ctrl+C to stop all components")
        
        # Keep main thread alive
        while True:
            time.sleep(1)
            # Check if any process has died
            for process, _ in processes:
                if process.poll() is not None:
                    print(f"⚠️  A component has stopped unexpectedly")
                    break
    
    except KeyboardInterrupt:
        print("\n🛑 Interrupted by user")
    finally:
        for process, _ in processes:
            if process.poll() is None:
                process.terminate()

if __name__ == "__main__":
    main()