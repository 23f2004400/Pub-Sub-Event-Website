#!/usr/bin/env python3

import asyncio
import subprocess
import sys
import time
import signal
from redis_client import RedisClient

class PubSubDemo:
    def __init__(self):
        self.processes = []
        self.redis_client = RedisClient()
    
    def cleanup_redis(self):
        """Clean up Redis streams for a fresh demo"""
        print("🧹 Cleaning up Redis streams for fresh demo...")
        self.redis_client.cleanup_streams()
        time.sleep(1)
    
    def start_component(self, script_name, component_name):
        """Start a component as a separate process"""
        print(f"🚀 Starting {component_name}...")
        process = subprocess.Popen([
            sys.executable, script_name
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, 
           universal_newlines=True, bufsize=1)
        
        self.processes.append((process, component_name))
        return process
    
    def stop_all_processes(self):
        """Stop all running processes"""
        print("\n🛑 Stopping all components...")
        for process, name in self.processes:
            if process.poll() is None:  # Process is still running
                print(f"   Stopping {name}...")
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
        self.processes.clear()
    
    async def run_demo(self):
        """Run the complete demo"""
        print("🎬 STARTING PUB/SUB EVENT PLANNING SYSTEM DEMO")
        print("=" * 60)
        
        # Clean up any previous state
        self.cleanup_redis()
        
        print("\n📋 DEMO OVERVIEW:")
        print("1. 🎛️  Coordinator will start and listen for invitations and responses")
        print("2. 👥 5 Event Guests will start and listen for invitations")
        print("3. 🎯 Event Host will create and publish an invitation")
        print("4. 🔄 Watch the complete Pub/Sub flow in action!")
        print("5. 📡 All communication happens via Redis Streams")
        print("\n" + "=" * 60)
        
        input("\n⏸️  Press Enter to start the demo...")
        
        try:
            # Start Coordinator
            print("\n🎛️  STARTING COORDINATOR...")
            coordinator_process = self.start_component("coordinator.py", "Coordinator")
            await asyncio.sleep(2)  # Give coordinator time to initialize
            
            # Start Guests
            print("\n👥 STARTING EVENT GUESTS...")
            guests_process = self.start_component("event_guest.py", "Event Guests")
            await asyncio.sleep(3)  # Give guests time to initialize
            
            # Start Host (this will create and send the invitation)
            print("\n🎯 STARTING EVENT HOST...")
            print("📤 The host will automatically create and send an invitation...")
            host_process = self.start_component("event_host.py", "Event Host")
            
            print("\n🔄 DEMO IS NOW RUNNING!")
            print("=" * 40)
            print("👀 Watch the console output to see:")
            print("   📨 Invitation being published by Host via Redis")
            print("   🎛️  Coordinator receiving and forwarding invitation")
            print("   👥 Guests receiving invitations and responding")
            print("   📊 Coordinator collecting responses and generating summary")
            print("   🎉 Host receiving the final summary")
            print("   📡 All messages flowing through Redis Pub/Sub streams")
            print("=" * 40)
            
            # Let the demo run for a reasonable time
            print("\n⏳ Demo will run for 30 seconds to show the complete flow...")
            await asyncio.sleep(30)
            
            print("\n🎬 DEMO COMPLETED!")
            print("✅ You should have seen the complete Pub/Sub event planning flow!")
            print("📡 All communication was handled via Redis Streams")
            
        except KeyboardInterrupt:
            print("\n🛑 Demo interrupted by user")
        finally:
            self.stop_all_processes()
    
    def signal_handler(self, signum, frame):
        """Handle interrupt signals"""
        print("\n🛑 Received interrupt signal...")
        self.stop_all_processes()
        sys.exit(0)

async def main():
    demo = PubSubDemo()
    
    # Set up signal handler
    signal.signal(signal.SIGINT, demo.signal_handler)
    
    await demo.run_demo()

if __name__ == "__main__":
    print("🎯 PUB/SUB EVENT PLANNING SYSTEM")
    print("=" * 40)
    print("📋 This demo will show you a complete Pub/Sub event planning system")
    print("🔧 Make sure Redis is running on localhost:6379")
    print("📦 Install dependencies: pip install -r requirements.txt")
    print("📡 Uses Redis Streams for reliable Pub/Sub messaging")
    print("=" * 40)
    
    # Check if Redis is available
    try:
        redis_client = RedisClient()
        redis_client.redis.ping()
        print("✅ Redis connection successful!")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("🔧 Please start Redis server and try again")
        sys.exit(1)
    
    asyncio.run(main())