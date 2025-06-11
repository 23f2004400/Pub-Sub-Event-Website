# Pub/Sub Event Planning System

A distributed event planning system built with Python and Redis Streams, demonstrating the Pub/Sub architectural pattern with three decoupled components.

## 🏗️ Architecture

### Components

1. **Event Host** (`event_host.py`)
   - Creates and publishes event invitations via Redis Streams
   - Receives final event summaries with guest responses
   - Runs as an independent Python process

2. **Coordinator** (`coordinator.py`) 
   - Central message router and orchestrator
   - Receives invitations from hosts via Redis Streams
   - Forwards invitations to all registered guests
   - Collects guest responses via Redis Streams
   - Generates and sends summaries back to hosts
   - Runs as an independent service

3. **Event Guests** (`event_guest.py`)
   - Multiple guest instances with different response preferences
   - Receive invitations via Redis Streams and make attendance decisions
   - Send responses back to coordinator via Redis Streams
   - Each guest runs with simulated personality traits

### Pub/Sub Mechanism - Redis Streams

Uses **Redis Streams** with consumer groups for reliable message delivery:

- `event_invitations` stream: Host → Coordinator → Guests
- `guest_responses` stream: Guests → Coordinator  
- `event_summaries` stream: Coordinator → Host

**Why Redis Streams?**
- **Ordered Messages**: Maintains event chronology
- **Consumer Groups**: Built-in load balancing and fault tolerance
- **Persistence**: Messages survive restarts
- **Acknowledgments**: Ensures reliable message processing
- **Scalability**: Handles high-throughput scenarios

## 🚀 Quick Start

### Prerequisites

```bash
# Install Redis
# On macOS: brew install redis
# On Ubuntu: sudo apt install redis-server
# On Windows: Use Redis for Windows or Docker

# Start Redis server
redis-server
```

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

### Running the Demo

#### Option 1: Automated Demo (Recommended for Video)
```bash
python demo.py
```
This runs a complete automated demonstration showing the entire Pub/Sub flow.

#### Option 2: Manual Component Control
```bash
python run_components.py
```
This starts all components with labeled output for detailed observation.

#### Option 3: Individual Components (3 Terminals)
Run each component in separate terminals to see pure output:

```bash
# Terminal 1 - Coordinator
python coordinator.py

# Terminal 2 - Guests (wait 2-3 seconds after coordinator)
python event_guest.py

# Terminal 3 - Host (wait 2-3 seconds after guests)
python event_host.py
```

## 🎯 Complete Pub/Sub Flow

1. **Host publishes invitation** → `event_invitations` Redis stream
2. **Coordinator receives invitation** → forwards to all guests via Redis
3. **Guests receive invitations** → make decisions based on preferences
4. **Guests send responses** → `guest_responses` Redis stream
5. **Coordinator collects responses** → generates summary
6. **Coordinator sends summary** → `event_summaries` Redis stream → Host receives final results

## 🔧 Configuration

### Guest Preferences
Each guest has configurable traits:
- `response_delay`: How long they take to respond (1-5 seconds)
- `likely_response`: Preferred response type ('yes', 'no', 'maybe')
- `response_probability`: Probability distribution for responses

### Redis Configuration
Configure via `.env` file:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

## 📊 Key Features

### Reliability via Redis Streams
- **Consumer Groups**: Ensures message delivery and prevents duplication
- **Message Acknowledgment**: Confirms successful processing
- **Error Handling**: Graceful failure recovery
- **Persistence**: Messages survive component restarts

### Scalability  
- **Horizontal Scaling**: Multiple coordinator or guest instances
- **Load Distribution**: Redis Streams handle high message volumes
- **Decoupled Architecture**: Components can be deployed independently

### Observability
- **Rich Logging**: Detailed console output with emojis for clarity
- **Message Tracking**: Full visibility into Pub/Sub message flow
- **Status Monitoring**: Real-time component status

## 🎥 Demo Video Features

Perfect for video demonstration:
- Clear console output with visual indicators
- Realistic timing and delays showing async processing
- Multiple guest personalities with different response patterns
- Complete end-to-end Pub/Sub flow visualization
- Professional logging with emojis and formatting
- Redis Streams message flow clearly visible

## 🚀 Production Considerations

### If I Had More Time, I Would Add:

1. **Enhanced Reliability**
   - Dead letter queues for failed messages
   - Message retry mechanisms with exponential backoff
   - Health checks and heartbeat monitoring
   - Circuit breakers for Redis connection failures

2. **Advanced Pub/Sub Features**
   - Message filtering and routing rules
   - Priority queues for urgent invitations
   - Message TTL (Time To Live) for expired invitations
   - Batch processing for high-volume scenarios

3. **Scalability Improvements**
   - Database persistence (PostgreSQL/MongoDB)
   - Redis Cluster for horizontal scaling
   - Load balancers for multiple coordinator instances
   - Message partitioning for high throughput

4. **Security & Authentication**
   - Redis AUTH for secure connections
   - Message encryption for sensitive data
   - JWT-based authentication between components
   - Role-based access control (RBAC)

5. **Monitoring & Observability**
   - Prometheus metrics for Redis Streams
   - Grafana dashboards for message flow visualization
   - Distributed tracing with Jaeger
   - Alert management for failed messages

6. **Advanced Event Features**
   - Event scheduling and reminders
   - RSVP deadlines and automatic follow-ups
   - Guest dietary preferences and special requirements
   - Calendar integration (Google Calendar, Outlook)

7. **DevOps & Deployment**
   - Docker containerization for each component
   - Kubernetes orchestration with Redis operator
   - CI/CD pipelines with automated testing
   - Infrastructure as Code (Terraform)

## 🏆 Why This Architecture?

### Redis Streams Choice
- **Simpler than Kafka**: Easier setup and management
- **More Reliable than Basic Pub/Sub**: Consumer groups and acknowledgments
- **Built-in Persistence**: Unlike RabbitMQ's default memory-only queues
- **Excellent Performance**: High throughput with low latency
- **Rich Ecosystem**: Great Python client support

### Decoupled Design Benefits
- **Independent Scaling**: Scale components based on load
- **Technology Flexibility**: Could replace Redis with Kafka/RabbitMQ
- **Fault Isolation**: One component failure doesn't crash the system
- **Development Velocity**: Teams can work on components independently
- **Easy Testing**: Each component can be tested in isolation

This system demonstrates enterprise-grade Pub/Sub patterns using Redis Streams while remaining simple enough for clear demonstration and video recording. The three separate Python processes communicate purely through Redis Streams, showcasing true distributed architecture.
