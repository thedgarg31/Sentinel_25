class OutputHandler:
    """
    Handles the output of the fraud detection system, now including LLM reasoning and dynamic thresholds.
    """
    def display_results(self, fraud_result, reasoning=None):
        """
        Displays the final fraud assessment with dynamic threshold information.

        Args:
            fraud_result (dict): Complete fraud analysis result including threshold info.
            reasoning (str, optional): The explanation from the LLM for the score.
        """
        # Extract values from result dict
        fraud_score = fraud_result.get('fraud_score', 0.0)
        threshold_used = fraud_result.get('threshold_used', 0.40)
        threshold_analysis = fraud_result.get('threshold_analysis', {})
        is_fraud = fraud_result.get('is_fraud', False)

        print(f"Final Fraud Score: {fraud_score:.2f}")
        print(f"Dynamic Threshold: {threshold_used:.2f}")
        
        # Display threshold analysis if available
        if threshold_analysis:
            print(f"Threshold Risk Level: {threshold_analysis.get('risk_level', 'Unknown')}")
            print(f"Threshold Rationale: {threshold_analysis.get('threshold_rationale', 'No rationale available')}")

        # Only print reasoning if it was provided (i.e., if LLM ran)
        if reasoning:
            print(f"LLM Reasoning: {reasoning}")

        if is_fraud:
            print(f"\n🚨 ALERT: This call is HIGHLY LIKELY to be fraudulent (Score {fraud_score:.2f} >= {threshold_used:.2f}).")
        else:
            print(f"\n✅ Analysis Complete: This call appears to be legitimate (Score {fraud_score:.2f} < {threshold_used:.2f}).")