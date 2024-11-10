# Nuri Products Api

Fastapi project

## Deployment

With google cloud run:

```
gcloud run deploy nuri-products \
  --port 8080 \
  --source . \
  --update-secrets=MONGODB_URI=MONGODB_URI:latest,JWT_PUBLIC=JWT_PUBLIC:latest \
  --memory=128Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1 \
  --allow-unauthenticated
```
