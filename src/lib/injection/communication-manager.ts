/**
 * PulseGen Studio - Communication Manager
 * Handles communication with injected GHL scripts
 */

export interface GHLConnection {
  id: string;
  url: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastSeen: Date;
  theme?: any;
  version?: string;
}

export interface GHLMessage {
  type: string;
  source: string;
  data: any;
  timestamp: string;
  version: string;
}

export class PulseGenCommunicationManager {
  private connections: Map<string, GHLConnection> = new Map();
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private debugMode = false;

  constructor() {
    this.initializeMessageHandlers();
    this.startHeartbeat();
  }

  private initializeMessageHandlers() {
    // Handle status responses
    this.messageHandlers.set('PG_STATUS_RESPONSE', (data) => {
      this.handleStatusResponse(data);
    });

    // Handle heartbeat responses
    this.messageHandlers.set('PG_HEARTBEAT', (data) => {
      this.handleHeartbeat(data);
    });

    // Handle errors
    this.messageHandlers.set('PG_ERROR', (data) => {
      this.handleError(data);
    });
  }

  private handleStatusResponse(data: any) {
    const connectionId = this.generateConnectionId(data.url);
    const connection: GHLConnection = {
      id: connectionId,
      url: data.url,
      status: 'connected',
      lastSeen: new Date(),
      theme: data.theme,
      version: data.version
    };

    this.connections.set(connectionId, connection);
    this.log('Status response received', connection);
  }

  private handleHeartbeat(data: any) {
    // Update last seen for all connections
    this.connections.forEach((connection) => {
      connection.lastSeen = new Date();
    });
  }

  private handleError(data: any) {
    this.log('Error received from GHL', data);
    // Could emit error events or show notifications
  }

  private generateConnectionId(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}-${urlObj.pathname}`.replace(/[^a-zA-Z0-9-]/g, '-');
    } catch {
      return `connection-${Date.now()}`;
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000); // Every 30 seconds
  }

  private sendHeartbeat() {
    this.connections.forEach((connection) => {
      this.sendMessage(connection, 'PG_HEARTBEAT', {});
    });
  }

  private sendMessage(connection: GHLConnection, type: string, data: any) {
    const message = {
      type,
      data,
      timestamp: new Date().toISOString(),
      source: 'pulsegen-studio'
    };

    // In a real implementation, this would send to the specific GHL window
    // For now, we'll simulate the communication
    this.log('Sending message', { connection: connection.id, message });
  }

  public connectToGHL(url: string): Promise<GHLConnection> {
    return new Promise((resolve, reject) => {
      const connectionId = this.generateConnectionId(url);
      
      // Check if already connected
      if (this.connections.has(connectionId)) {
        const connection = this.connections.get(connectionId)!;
        if (connection.status === 'connected') {
          resolve(connection);
          return;
        }
      }

      // Create new connection
      const connection: GHLConnection = {
        id: connectionId,
        url,
        status: 'connecting',
        lastSeen: new Date()
      };

      this.connections.set(connectionId, connection);

      // Simulate connection process
      setTimeout(() => {
        connection.status = 'connected';
        resolve(connection);
      }, 1000);

      this.log('Connecting to GHL', connection);
    });
  }

  public disconnectFromGHL(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.status = 'disconnected';
      this.log('Disconnected from GHL', connection);
    }
  }

  public sendThemeUpdate(connectionId: string, theme: any): Promise<boolean> {
    return new Promise((resolve) => {
      const connection = this.connections.get(connectionId);
      if (!connection || connection.status !== 'connected') {
        resolve(false);
        return;
      }

      this.sendMessage(connection, 'PG_THEME_UPDATE', theme);
      
      // Simulate successful update
      setTimeout(() => {
        connection.theme = theme;
        resolve(true);
      }, 500);
    });
  }

  public removeTheme(connectionId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const connection = this.connections.get(connectionId);
      if (!connection || connection.status !== 'connected') {
        resolve(false);
        return;
      }

      this.sendMessage(connection, 'PG_THEME_REMOVE', {});
      
      // Simulate successful removal
      setTimeout(() => {
        connection.theme = null;
        resolve(true);
      }, 500);
    });
  }

  public getConnections(): GHLConnection[] {
    return Array.from(this.connections.values());
  }

  public getConnection(connectionId: string): GHLConnection | undefined {
    return this.connections.get(connectionId);
  }

  public cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.connections.clear();
    this.log('Communication manager cleaned up');
  }

  private log(message: string, data?: any): void {
    if (this.debugMode) {
      console.log(`[PulseGen Communication] ${message}`, data);
    }
  }

  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }
}

// Singleton instance
export const communicationManager = new PulseGenCommunicationManager();
