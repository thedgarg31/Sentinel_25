import numpy as np
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
from sklearn.feature_extraction.text import TfidfVectorizer
import re
import librosa
from typing import Dict, List, Tuple, Optional
import json

class BERTTextAnalyzer:
    """Advanced BERT-based text analysis for fraud detection"""
    
    def __init__(self):
        # Load pre-trained BERT model for text classification
        self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        self.model = AutoModel.from_pretrained('bert-base-uncased')
        self.model.eval()
        
        # Fraud-specific keywords and patterns
        self.fraud_keywords = {
            'urgency': ['immediately', 'urgent', 'right now', 'hurry', 'act fast', 'limited time'],
            'authority': ['irs', 'fbi', 'police', 'government', 'court', 'legal', 'arrest'],
            'financial': ['bank', 'account', 'credit card', 'payment', 'transfer', 'wire', 'money'],
            'personal_info': ['ssn', 'social security', 'otp', 'password', 'verification', 'confirm'],
            'threats': ['sued', 'arrested', 'jail', 'prosecuted', 'legal action', 'consequences'],
            'rewards': ['prize', 'winner', 'lottery', 'free', 'grant', 'inheritance', 'bonus']
        }
        
        # Scam pattern indicators
        self.scam_patterns = [
            r'you have won.*prize',
            r'your account will be.*closed',
            r'pay.*or.*will be.*arrested',
            r'confirm.*personal.*information',
            r'click.*link.*immediately',
            r'do not.*tell.*anyone',
            r'act.*now.*or.*lose'
        ]
    
    def analyze_text(self, text: str) -> Dict:
        """Analyze text for fraud indicators using BERT and rule-based methods"""
        
        # BERT-based semantic analysis
        inputs = self.tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1).numpy()
        
        # Keyword-based analysis
        keyword_scores = self._analyze_keywords(text)
        
        # Pattern matching
        pattern_score = self._analyze_patterns(text)
        
        # Linguistic features
        linguistic_features = self._extract_linguistic_features(text)
        
        # Combine all features
        fraud_score = self._calculate_fraud_score(
            embeddings, keyword_scores, pattern_score, linguistic_features
        )
        
        return {
            'fraud_score': float(fraud_score),
            'bert_embeddings': embeddings.tolist(),
            'keyword_analysis': keyword_scores,
            'pattern_score': pattern_score,
            'linguistic_features': linguistic_features,
            'risk_level': self._get_risk_level(fraud_score),
            'explanations': self._generate_explanations(keyword_scores, pattern_score)
        }
    
    def _analyze_keywords(self, text: str) -> Dict:
        """Analyze fraud-related keywords in text"""
        text_lower = text.lower()
        scores = {}
        
        for category, keywords in self.fraud_keywords.items():
            score = 0
            for keyword in keywords:
                if keyword in text_lower:
                    score += text_lower.count(keyword)
            scores[category] = min(score / len(keywords), 1.0)
        
        return scores
    
    def _analyze_patterns(self, text: str) -> float:
        """Analyze scam patterns using regex"""
        pattern_score = 0
        text_lower = text.lower()
        
        for pattern in self.scam_patterns:
            if re.search(pattern, text_lower):
                pattern_score += 1
        
        return min(pattern_score / len(self.scam_patterns), 1.0)
    
    def _extract_linguistic_features(self, text: str) -> Dict:
        """Extract linguistic features for fraud detection"""
        features = {
            'uppercase_ratio': sum(1 for c in text if c.isupper()) / len(text) if text else 0,
            'exclamation_count': text.count('!'),
            'question_count': text.count('?'),
            'sentence_count': len(re.split(r'[.!?]+', text)),
            'avg_sentence_length': 0,
            'urgency_words': 0,
            'authority_words': 0
        }
        
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        if sentences:
            features['avg_sentence_length'] = sum(len(s.split()) for s in sentences) / len(sentences)
        
        # Count urgency and authority words
        text_lower = text.lower()
        for word in self.fraud_keywords['urgency']:
            features['urgency_words'] += text_lower.count(word)
        for word in self.fraud_keywords['authority']:
            features['authority_words'] += text_lower.count(word)
        
        return features
    
    def _calculate_fraud_score(self, embeddings: np.ndarray, keyword_scores: Dict, 
                              pattern_score: float, linguistic_features: Dict) -> float:
        """Calculate overall fraud score combining all features"""
        
        # BERT semantic score (simplified)
        bert_score = np.mean(np.abs(embeddings)) * 0.1
        
        # Keyword score
        keyword_score = np.mean(list(keyword_scores.values()))
        
        # Pattern score
        pattern_weight = pattern_score * 0.3
        
        # Linguistic score
        linguistic_score = (
            min(features['uppercase_ratio'] * 5, 1.0) * 0.1 +
            min(features['exclamation_count'] / 10, 1.0) * 0.1 +
            min(features['urgency_words'] / 5, 1.0) * 0.2 +
            min(features['authority_words'] / 3, 1.0) * 0.2
        )
        
        # Combine scores with weights
        total_score = (
            bert_score * 0.2 +
            keyword_score * 0.3 +
            pattern_weight * 0.3 +
            linguistic_score * 0.2
        )
        
        return min(total_score, 1.0)
    
    def _get_risk_level(self, score: float) -> str:
        """Convert fraud score to risk level"""
        if score < 0.3:
            return 'low'
        elif score < 0.6:
            return 'medium'
        elif score < 0.8:
            return 'high'
        else:
            return 'critical'
    
    def _generate_explanations(self, keyword_scores: Dict, pattern_score: float) -> List[str]:
        """Generate human-readable explanations for fraud detection"""
        explanations = []
        
        # Keyword-based explanations
        for category, score in keyword_scores.items():
            if score > 0.5:
                if category == 'urgency':
                    explanations.append("High urgency language detected - caller trying to rush you")
                elif category == 'authority':
                    explanations.append("Authority impersonation detected - claiming official status")
                elif category == 'financial':
                    explanations.append("Financial pressure tactics detected")
                elif category == 'personal_info':
                    explanations.append("Request for sensitive personal information")
                elif category == 'threats':
                    explanations.append("Threats or intimidation detected")
                elif category == 'rewards':
                    explanations.append("Unrealistic reward or prize claims")
        
        # Pattern-based explanations
        if pattern_score > 0.5:
            explanations.append("Known scam patterns detected in conversation")
        
        return explanations


class LSTMAudioAnalyzer:
    """LSTM-based audio analysis for fraud detection"""
    
    def __init__(self):
        # Initialize LSTM model for audio analysis
        self.lstm_model = self._build_lstm_model()
        self.lstm_model.eval()
        
        # Audio feature extractors
        self.sample_rate = 16000
        
    def _build_lstm_model(self) -> nn.Module:
        """Build LSTM model for audio sequence analysis"""
        class AudioLSTM(nn.Module):
            def __init__(self):
                super().__init__()
                self.lstm = nn.LSTM(input_size=13, hidden_size=64, num_layers=2, batch_first=True)
                self.fc = nn.Linear(64, 32)
                self.output = nn.Linear(32, 1)
                self.dropout = nn.Dropout(0.3)
                
            def forward(self, x):
                lstm_out, _ = self.lstm(x)
                # Take the last output
                output = self.dropout(lstm_out[:, -1, :])
                output = torch.relu(self.fc(output))
                output = torch.sigmoid(self.output(output))
                return output
        
        return AudioLSTM()
    
    def analyze_audio(self, audio_path: str) -> Dict:
        """Analyze audio file for fraud indicators"""
        
        try:
            # Load audio
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Extract audio features
            features = self._extract_audio_features(y, sr)
            
            # Prepare LSTM input
            lstm_input = self._prepare_lstm_input(features)
            
            # Get LSTM prediction
            with torch.no_grad():
                lstm_score = self.lstm_model(lstm_input).item()
            
            # Additional acoustic analysis
            acoustic_features = self._analyze_acoustic_patterns(y, sr)
            
            # Combine scores
            fraud_score = self._combine_audio_scores(lstm_score, acoustic_features)
            
            return {
                'fraud_score': float(fraud_score),
                'lstm_score': float(lstm_score),
                'acoustic_features': acoustic_features,
                'audio_features': features,
                'risk_level': self._get_risk_level(fraud_score),
                'explanations': self._generate_audio_explanations(acoustic_features)
            }
            
        except Exception as e:
            return {
                'fraud_score': 0.0,
                'error': str(e),
                'risk_level': 'low'
            }
    
    def _extract_audio_features(self, y: np.ndarray, sr: int) -> Dict:
        """Extract comprehensive audio features"""
        features = {}
        
        # MFCC features
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        features['mfcc_mean'] = np.mean(mfccs, axis=1).tolist()
        features['mfcc_std'] = np.std(mfccs, axis=1).tolist()
        
        # Pitch features
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        pitch_values = []
        for t in range(pitches.shape[1]):
            index = magnitudes[:, t].argmax()
            pitch = pitches[index, t]
            if pitch > 0:
                pitch_values.append(pitch)
        
        if pitch_values:
            features['pitch_mean'] = np.mean(pitch_values)
            features['pitch_std'] = np.std(pitch_values)
            features['pitch_range'] = np.max(pitch_values) - np.min(pitch_values)
        else:
            features['pitch_mean'] = 0
            features['pitch_std'] = 0
            features['pitch_range'] = 0
        
        # Energy features
        features['energy'] = np.sum(y ** 2)
        features['energy_std'] = np.std(librosa.feature.rms(y=y)[0])
        
        # Spectral features
        spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        features['spectral_centroid_mean'] = np.mean(spectral_centroids)
        features['spectral_centroid_std'] = np.std(spectral_centroids)
        
        # Zero crossing rate
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        features['zcr_mean'] = np.mean(zcr)
        features['zcr_std'] = np.std(zcr)
        
        # Tempo
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
        features['tempo'] = float(tempo)
        
        return features
    
    def _prepare_lstm_input(self, features: Dict) -> torch.Tensor:
        """Prepare features for LSTM input"""
        # Combine MFCC features as sequence
        mfcc_sequence = np.array(features['mfcc_mean']).reshape(1, -1, 1)
        return torch.FloatTensor(mfcc_sequence)
    
    def _analyze_acoustic_patterns(self, y: np.ndarray, sr: int) -> Dict:
        """Analyze acoustic patterns indicative of fraud"""
        patterns = {}
        
        # Speech rate analysis
        frames = librosa.util.frame(y, frame_length=2048, hop_length=512)
        energy = np.sum(frames ** 2, axis=0)
        speech_frames = energy > np.mean(energy) * 0.1
        patterns['speech_rate'] = np.sum(speech_frames) / len(speech_frames)
        
        # Pause analysis
        pauses = self._detect_pauses(y, sr)
        patterns['pause_frequency'] = len(pauses) / (len(y) / sr)
        patterns['avg_pause_duration'] = np.mean(pauses) if pauses else 0
        
        # Stress indicators (pitch variability)
        pitches, _ = librosa.piptrack(y=y, sr=sr)
        pitch_variability = np.std(pitches[pitches > 0]) if np.any(pitches > 0) else 0
        patterns['stress_indicator'] = min(pitch_variability / 100, 1.0)
        
        # Background noise analysis
        noise_level = np.percentile(np.abs(y), 10)
        patterns['background_noise'] = min(noise_level / 0.1, 1.0)
        
        return patterns
    
    def _detect_pauses(self, y: np.ndarray, sr: int) -> List[float]:
        """Detect pauses in speech"""
        # Simple energy-based pause detection
        frame_length = int(0.1 * sr)  # 100ms frames
        energy = []
        for i in range(0, len(y) - frame_length, frame_length):
            frame_energy = np.sum(y[i:i+frame_length] ** 2)
            energy.append(frame_energy)
        
        # Find pauses (low energy frames)
        threshold = np.mean(energy) * 0.1
        pause_durations = []
        current_pause = 0
        
        for e in energy:
            if e < threshold:
                current_pause += 1
            else:
                if current_pause > 0:
                    pause_durations.append(current_pause * 0.1)  # Convert to seconds
                    current_pause = 0
        
        return pause_durations
    
    def _combine_audio_scores(self, lstm_score: float, acoustic_features: Dict) -> float:
        """Combine LSTM and acoustic feature scores"""
        
        # Acoustic feature score
        acoustic_score = (
            min(acoustic_features.get('stress_indicator', 0) * 0.3, 0.3) +
            min(acoustic_features.get('pause_frequency', 0) * 0.2, 0.2) +
            min(acoustic_features.get('background_noise', 0) * 0.1, 0.1)
        )
        
        # Combine with LSTM score
        total_score = lstm_score * 0.7 + acoustic_score * 0.3
        
        return min(total_score, 1.0)
    
    def _get_risk_level(self, score: float) -> str:
        """Convert fraud score to risk level"""
        if score < 0.3:
            return 'low'
        elif score < 0.6:
            return 'medium'
        elif score < 0.8:
            return 'high'
        else:
            return 'critical'
    
    def _generate_audio_explanations(self, acoustic_features: Dict) -> List[str]:
        """Generate explanations for audio-based fraud detection"""
        explanations = []
        
        if acoustic_features.get('stress_indicator', 0) > 0.6:
            explanations.append("High stress detected in caller's voice")
        
        if acoustic_features.get('pause_frequency', 0) > 0.5:
            explanations.append("Unusual speech patterns with frequent pauses")
        
        if acoustic_features.get('background_noise', 0) > 0.7:
            explanations.append("Suspicious background noise patterns")
        
        return explanations


class VoiceFingerprinting:
    """Advanced voice fingerprinting for identifying repeat scammers"""
    
    def __init__(self):
        self.voice_database = {}  # In production, use a proper database
        self.similarity_threshold = 0.85
        
    def create_voiceprint(self, audio_path: str) -> np.ndarray:
        """Create voice fingerprint from audio"""
        try:
            y, sr = librosa.load(audio_path, sr=16000)
            
            # Extract MFCC features
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
            
            # Create voiceprint (simplified - in production use more sophisticated methods)
            voiceprint = np.mean(mfccs, axis=1)
            
            # Normalize
            voiceprint = voiceprint / np.linalg.norm(voiceprint)
            
            return voiceprint
            
        except Exception as e:
            print(f"Error creating voiceprint: {e}")
            return np.zeros(20)
    
    def match_voiceprint(self, voiceprint: np.ndarray) -> Optional[Dict]:
        """Match voiceprint against database"""
        best_match = None
        best_similarity = 0
        
        for voice_id, stored_voiceprint in self.voice_database.items():
            similarity = np.dot(voiceprint, stored_voiceprint)
            
            if similarity > best_similarity and similarity > self.similarity_threshold:
                best_similarity = similarity
                best_match = {
                    'voice_id': voice_id,
                    'similarity': float(similarity),
                    'confidence': float(similarity)
                }
        
        return best_match
    
    def store_voiceprint(self, voice_id: str, voiceprint: np.ndarray, metadata: Dict = None):
        """Store voiceprint in database"""
        self.voice_database[voice_id] = {
            'voiceprint': voiceprint,
            'metadata': metadata or {},
            'created_at': str(np.datetime64('now'))
        }
    
    def identify_scammer_network(self, voiceprint: np.ndarray) -> Dict:
        """Identify if voice matches known scammer networks"""
        match = self.match_voiceprint(voiceprint)
        
        if match:
            return {
                'is_known_scammer': True,
                'voice_id': match['voice_id'],
                'confidence': match['confidence'],
                'network_info': self.voice_database[match['voice_id']].get('metadata', {})
            }
        else:
            return {
                'is_known_scammer': False,
                'confidence': 0.0
            }


class AdvancedFraudDetector:
    """Main advanced fraud detection system combining all models"""
    
    def __init__(self):
        self.text_analyzer = BERTTextAnalyzer()
        self.audio_analyzer = LSTMAudioAnalyzer()
        self.voice_fingerprinting = VoiceFingerprinting()
        
    def analyze_call(self, audio_path: str, transcript: str = None) -> Dict:
        """Comprehensive call analysis using all advanced models"""
        
        # Audio analysis
        audio_results = self.audio_analyzer.analyze_audio(audio_path)
        
        # Text analysis (if transcript available)
        text_results = None
        if transcript:
            text_results = self.text_analyzer.analyze_text(transcript)
        
        # Voice fingerprinting
        voiceprint = self.voice_fingerprinting.create_voiceprint(audio_path)
        voice_match = self.voice_fingerprinting.match_voiceprint(voiceprint)
        
        # Combine all results
        combined_score = self._combine_all_scores(audio_results, text_results, voice_match)
        
        return {
            'overall_fraud_score': combined_score,
            'risk_level': self._get_risk_level(combined_score),
            'audio_analysis': audio_results,
            'text_analysis': text_results,
            'voice_fingerprinting': voice_match,
            'explanations': self._generate_comprehensive_explanations(
                audio_results, text_results, voice_match
            ),
            'recommendations': self._generate_recommendations(combined_score, voice_match)
        }
    
    def _combine_all_scores(self, audio_results: Dict, text_results: Dict, voice_match: Optional[Dict]) -> float:
        """Combine scores from all models"""
        
        audio_score = audio_results.get('fraud_score', 0.0)
        text_score = text_results.get('fraud_score', 0.0) if text_results else 0.0
        
        # Weight the scores
        combined = (
            audio_score * 0.5 +
            text_score * 0.3 +
            (voice_match['confidence'] if voice_match else 0.0) * 0.2
        )
        
        return min(combined, 1.0)
    
    def _get_risk_level(self, score: float) -> str:
        """Convert fraud score to risk level"""
        if score < 0.3:
            return 'low'
        elif score < 0.6:
            return 'medium'
        elif score < 0.8:
            return 'high'
        else:
            return 'critical'
    
    def _generate_comprehensive_explanations(self, audio_results: Dict, text_results: Dict, voice_match: Optional[Dict]) -> List[str]:
        """Generate comprehensive explanations"""
        explanations = []
        
        # Audio explanations
        if audio_results.get('explanations'):
            explanations.extend(audio_results['explanations'])
        
        # Text explanations
        if text_results and text_results.get('explanations'):
            explanations.extend(text_results['explanations'])
        
        # Voice fingerprinting explanations
        if voice_match:
            explanations.append(f"Voice matches known scammer (confidence: {voice_match['confidence']:.2f})")
        
        return explanations
    
    def _generate_recommendations(self, score: float, voice_match: Optional[Dict]) -> List[str]:
        """Generate safety recommendations"""
        recommendations = []
        
        if score > 0.8:
            recommendations.extend([
                "BLOCK this number immediately",
                "Report to authorities",
                "Do not engage with caller"
            ])
        elif score > 0.6:
            recommendations.extend([
                "Exercise extreme caution",
                "Verify caller identity independently",
                "Do not share personal information"
            ])
        elif score > 0.3:
            recommendations.extend([
                "Be cautious with this caller",
                "Avoid sharing sensitive information"
            ])
        
        if voice_match:
            recommendations.append("Known scammer voice detected - high threat level")
        
        return recommendations
