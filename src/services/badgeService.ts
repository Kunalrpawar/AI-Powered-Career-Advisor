interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  earnedAt?: string;
}

interface BadgeResponse {
  success: boolean;
  badge?: Badge;
  isNewBadge?: boolean;
  message?: string;
  error?: string;
}

class BadgeService {
  private baseUrl = '/api/badges';

  private async makeRequest(endpoint: string, options?: RequestInit): Promise<any> {
    const token = localStorage.getItem('token');
    console.log('🔑 Token available:', !!token);
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    console.log('🌐 Making request to:', `${this.baseUrl}${endpoint}`);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    console.log('📊 Response status:', response.status);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      console.error('❌ Request failed:', error);
      throw new Error(error.error || 'Request failed');
    }

    const result = await response.json();
    console.log('✅ Request successful:', result);
    return result;
  }

  async awardBadge(badgeId: string): Promise<BadgeResponse> {
    try {
      return await this.makeRequest('/award', {
        method: 'POST',
        body: JSON.stringify({ badgeId }),
      });
    } catch (error: any) {
      // If badge already earned, don't treat as error
      if (error.message.includes('already earned')) {
        return { success: false, error: error.message };
      }
      throw error;
    }
  }

  async getMyBadges(): Promise<{ badges: Badge[]; totalBadges: number }> {
    return await this.makeRequest('/my-badges');
  }

  async getAvailableBadges(): Promise<{ badges: Badge[] }> {
    return await this.makeRequest('/available');
  }

  // Badge trigger methods
  async triggerCareerMappingBadge(): Promise<BadgeResponse | null> {
    try {
      return await this.awardBadge('career-mapper');
    } catch (error) {
      console.error('Failed to award career mapping badge:', error);
      return null;
    }
  }

  async triggerMentorBookingBadge(): Promise<BadgeResponse | null> {
    try {
      return await this.awardBadge('mentor-booker');
    } catch (error) {
      console.error('Failed to award mentor booking badge:', error);
      return null;
    }
  }

  async triggerAptitudeBadge(): Promise<BadgeResponse | null> {
    try {
      return await this.awardBadge('aptitude-ace');
    } catch (error) {
      console.error('Failed to award aptitude badge:', error);
      return null;
    }
  }
}

export const badgeService = new BadgeService();
export type { Badge, BadgeResponse };