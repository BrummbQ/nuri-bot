# Setup app on kubernetes

1. i.e. with k3s https://k3s.io
2. Copy kubeconfig and adjust server address
3. Configure dns records

## Setup Postgres DB on cluster

```
helm repo add cnpg https://cloudnative-pg.github.io/charts
helm upgrade --install cnpg \
  --namespace cnpg-system \
  --create-namespace \
  cnpg/cloudnative-pg
```

## Deploy App

Deployed with helm on CI

# Setup CI

1. create serviceaccount with ci-serviceaccount.yaml
2. create custom kubeconfig with token

# Local Development

Port forward for postgres db: `kubectl port-forward svc/postgres-cluster-rw 5432:5432 -n nuri-prod`
