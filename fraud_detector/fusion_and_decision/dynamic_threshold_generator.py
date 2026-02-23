"""
Dynamic Threshold Generator for CallGuard Sentinel
Generates personalized thresholds for each call based on call characteristics
"""

import numpy as np
from datetime import datetime
from typing import Dict, Tuple, Optional

class DynamicThresholdGenerator:
    """
    Generates dynamic thresholds for fraud detection based on call characteristics.
    Each call gets its own threshold based on multiple factors.
    """
    
    def __init__(self):
        """Initialize the dynamic threshold generator with base parameters."""
        
        # Base threshold ranges
        self.BASE_THRESHOLD_MIN = 0.20
        self.BASE_THRESHOLD_MAX = 0.60
        
        # Threshold adjustment factors
        self.RISK_FACTORS = {
            'call_duration': {
                'short_calls': {'min': 0, 'max': 30, 'adjustment': 0.15},      # Very short calls are suspicious
                'normal_calls': {'min': 30, 'max': 300, 'adjustment': 0.0},     # Normal duration
                'long_calls': {'min': 300, 'max': float('inf'), 'adjustment': -0.05}  # Very long calls might be legitimate
            },
            'caller_behavior': {
                'rapid_speech': {'adjustment': 0.10},      # Fast talking = high pressure
                'hesitant_speech': {'adjustment': 0.05},   # Hesitation = uncertainty
                'normal_speech': {'adjustment': 0.0},       # Normal speech pattern
                'aggressive_tone': {'adjustment': 0.15}     # Aggressive = high risk
            },
            'time_of_day': {
                'business_hours': {'start': 9, 'end': 17, 'adjustment': -0.05},   # Business hours = more legitimate
                'evening_hours': {'start': 17, 'end': 21, 'adjustment': 0.05},    # Evening = slightly suspicious
                'night_hours': {'start': 21, 'end': 6, 'adjustment': 0.15},       # Night = high suspicion
                'weekend': {'adjustment': 0.08}                                    # Weekend = more suspicious
            },
            'call_patterns': {
                'first_time_caller': {'adjustment': 0.10},    # Unknown caller
                'known_contact': {'adjustment': -0.05},       # Known contact
                'repeated_calls': {'adjustment': 0.12},       # Multiple calls quickly
                'international': {'adjustment': 0.15}        # International number
            },
            'content_analysis': {
                'financial_discussion': {'adjustment': 0.20},  # Money/finance topics
                'personal_info_request': {'adjustment': 0.25}, # Asking for personal info
                'urgent_language': {'adjustment': 0.15},       # Urgency indicators
                'threatening_language': {'adjustment': 0.30},   # Threats
                'normal_conversation': {'adjustment': -0.05}    # Normal topics
            }
        }
        
        print("✓ Dynamic Threshold Generator initialized")
        print(f"  - Base threshold range: {self.BASE_THRESHOLD_MIN} - {self.BASE_THRESHOLD_MAX}")
    
    def generate_threshold(self, call_metadata: Dict, audio_features: Dict, text_features: Dict) -> Tuple[float, Dict]:
        """
        Generate a dynamic threshold for a specific call.
        
        Args:
            call_metadata: Call information (duration, time, caller info, etc.)
            audio_features: Extracted audio characteristics
            text_features: Extracted text characteristics
            
        Returns:
            Tuple of (threshold_value, threshold_analysis)
        """
        
        # Start with base threshold
        base_threshold = (self.BASE_THRESHOLD_MIN + self.BASE_THRESHOLD_MAX) / 2
        threshold_adjustments = []
        
        # 1. Duration-based adjustment
        duration_adjustment = self._calculate_duration_adjustment(call_metadata.get('duration', 0))
        if duration_adjustment != 0:
            threshold_adjustments.append(('call_duration', duration_adjustment))
        
        # 2. Time-based adjustment
        time_adjustment = self._calculate_time_adjustment(call_metadata.get('timestamp', datetime.now()))
        if time_adjustment != 0:
            threshold_adjustments.append(('time_of_day', time_adjustment))
        
        # 3. Caller pattern adjustment
        pattern_adjustment = self._calculate_pattern_adjustment(call_metadata)
        if pattern_adjustment != 0:
            threshold_adjustments.append(('call_patterns', pattern_adjustment))
        
        # 4. Audio behavior adjustment
        audio_adjustment = self._calculate_audio_adjustment(audio_features)
        if audio_adjustment != 0:
            threshold_adjustments.append(('caller_behavior', audio_adjustment))
        
        # 5. Content-based adjustment
        content_adjustment = self._calculate_content_adjustment(text_features)
        if content_adjustment != 0:
            threshold_adjustments.append(('content_analysis', content_adjustment))
        
        # Calculate final threshold
        total_adjustment = sum(adj for _, adj in threshold_adjustments)
        final_threshold = base_threshold + total_adjustment
        
        # Ensure threshold stays within reasonable bounds
        final_threshold = max(self.BASE_THRESHOLD_MIN, min(self.BASE_THRESHOLD_MAX, final_threshold))
        
        # Create analysis report
        analysis = {
            'base_threshold': base_threshold,
            'total_adjustment': total_adjustment,
            'final_threshold': final_threshold,
            'adjustments': threshold_adjustments,
            'threshold_rationale': self._generate_rationale(threshold_adjustments, final_threshold),
            'risk_level': self._categorize_risk_level(final_threshold)
        }
        
        return final_threshold, analysis
    
    def _calculate_duration_adjustment(self, duration: float) -> float:
        """Calculate threshold adjustment based on call duration."""
        
        for category, config in self.RISK_FACTORS['call_duration'].items():
            if config['min'] <= duration < config['max']:
                return config['adjustment']
        
        return 0.0
    
    def _calculate_time_adjustment(self, timestamp) -> float:
        """Calculate threshold adjustment based on time of call."""
        
        current_time = timestamp if isinstance(timestamp, datetime) else datetime.now()
        hour = current_time.hour
        weekday = current_time.weekday()  # 0 = Monday, 6 = Sunday
        
        # Check time of day
        for category, config in self.RISK_FACTORS['time_of_day'].items():
            if category == 'business_hours':
                if config['start'] <= hour < config['end'] and weekday < 5:
                    return config['adjustment']
            elif category == 'evening_hours':
                if config['start'] <= hour < config['end']:
                    return config['adjustment']
            elif category == 'night_hours':
                if hour >= config['start'] or hour < config['end']:
                    return config['adjustment']
        
        # Check weekend
        if weekday >= 5:  # Saturday or Sunday
            return self.RISK_FACTORS['time_of_day']['weekend']['adjustment']
        
        return 0.0
    
    def _calculate_pattern_adjustment(self, call_metadata: Dict) -> float:
        """Calculate threshold adjustment based on call patterns."""
        
        adjustment = 0.0
        
        # Check if first time caller
        if call_metadata.get('first_time_caller', True):
            adjustment += self.RISK_FACTORS['call_patterns']['first_time_caller']['adjustment']
        
        # Check for repeated calls
        if call_metadata.get('repeated_calls', False):
            adjustment += self.RISK_FACTORS['call_patterns']['repeated_calls']['adjustment']
        
        # Check if international
        if call_metadata.get('international_call', False):
            adjustment += self.RISK_FACTORS['call_patterns']['international']['adjustment']
        
        return adjustment
    
    def _calculate_audio_adjustment(self, audio_features: Dict) -> float:
        """Calculate threshold adjustment based on audio characteristics."""
        
        adjustment = 0.0
        
        # Speech rate analysis
        speech_rate = audio_features.get('speech_rate', 150)  # words per minute
        if speech_rate > 180:  # Rapid speech
            adjustment += self.RISK_FACTORS['caller_behavior']['rapid_speech']['adjustment']
        elif speech_rate < 100:  # Hesitant speech
            adjustment += self.RISK_FACTORS['caller_behavior']['hesitant_speech']['adjustment']
        
        # Energy spikes (aggressive tone)
        energy_spikes = audio_features.get('energy_spikes', 0)
        if energy_spikes > 8:
            adjustment += self.RISK_FACTORS['caller_behavior']['aggressive_tone']['adjustment']
        
        return adjustment
    
    def _calculate_content_adjustment(self, text_features: Dict) -> float:
        """Calculate threshold adjustment based on content analysis."""
        
        adjustment = 0.0
        
        # Check for financial discussion
        if text_features.get('financial_keywords', {}).get('score', 0) > 0.3:
            adjustment += self.RISK_FACTORS['content_analysis']['financial_discussion']['adjustment']
        
        # Check for personal info requests
        if text_features.get('pii_requests', {}).get('score', 0) > 0.2:
            adjustment += self.RISK_FACTORS['content_analysis']['personal_info_request']['adjustment']
        
        # Check for urgent language
        if text_features.get('urgency', {}).get('score', 0) > 0.3:
            adjustment += self.RISK_FACTORS['content_analysis']['urgent_language']['adjustment']
        
        # Check for threats
        if text_features.get('threats', {}).get('score', 0) > 0.2:
            adjustment += self.RISK_FACTORS['content_analysis']['threatening_language']['adjustment']
        
        return adjustment
    
    def _generate_rationale(self, adjustments: list, final_threshold: float) -> str:
        """Generate human-readable explanation for the threshold."""
        
        if not adjustments:
            return f"Standard threshold applied: {final_threshold:.3f} (no special risk factors detected)"
        
        rationale_parts = []
        for factor, adjustment in adjustments:
            if adjustment > 0:
                rationale_parts.append(f"{factor} increased threshold by {adjustment:.3f}")
            else:
                rationale_parts.append(f"{factor} decreased threshold by {abs(adjustment):.3f}")
        
        rationale = "Threshold adjustments: " + ", ".join(rationale_parts)
        rationale += f"\nFinal threshold: {final_threshold:.3f}"
        
        return rationale
    
    def _categorize_risk_level(self, threshold: float) -> str:
        """Categorize the risk level based on the threshold."""
        
        if threshold < 0.30:
            return "Low Sensitivity"
        elif threshold < 0.45:
            return "Medium Sensitivity"
        else:
            return "High Sensitivity"

# Example usage and testing
if __name__ == "__main__":
    # Test the dynamic threshold generator
    generator = DynamicThresholdGenerator()
    
    # Example call metadata
    call_metadata = {
        'duration': 45,  # Short call
        'timestamp': datetime.now(),
        'first_time_caller': True,
        'repeated_calls': False,
        'international_call': False
    }
    
    # Example features
    audio_features = {
        'speech_rate': 200,  # Rapid speech
        'energy_spikes': 10,  # High energy
        'pitch_variance': 3000
    }
    
    text_features = {
        'urgency': {'score': 0.6, 'evidence': ['immediately', 'right now']},
        'pii_requests': {'score': 0.4, 'evidence': ['social security']},
        'threats': {'score': 0.3, 'evidence': ['legal action']}
    }
    
    # Generate threshold
    threshold, analysis = generator.generate_threshold(call_metadata, audio_features, text_features)
    
    print(f"\n🎯 Dynamic Threshold Analysis:")
    print(f"Final Threshold: {threshold:.3f}")
    print(f"Risk Level: {analysis['risk_level']}")
    print(f"Rationale: {analysis['threshold_rationale']}")
