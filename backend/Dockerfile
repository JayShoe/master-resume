FROM directus/directus:11.13.4

USER root
WORKDIR /directus

# Copy extensions if any
COPY --chown=node:node extensions /directus/extensions

EXPOSE 8055

# Run as node user
CMD ["sh", "-c", "mkdir -p /data/uploads /data/extensions && chown -R node:node /data && su node -c 'npx directus bootstrap && npx directus start'"]