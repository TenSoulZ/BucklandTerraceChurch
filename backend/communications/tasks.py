from celery import shared_task
import time

@shared_task
def send_email_broadcast_task(broadcast_id):
    # Stub for sending email broadcast
    time.sleep(2)
    return f"Processed email broadcast {broadcast_id}"

@shared_task
def send_sms_broadcast_task(broadcast_id):
    # Stub for sending SMS broadcast
    time.sleep(2)
    return f"Processed SMS broadcast {broadcast_id}"
