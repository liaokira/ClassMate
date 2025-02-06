#!/bin/sh
set -e

# Export the PGPASSWORD environment variable so psql uses it automatically
export PGPASSWORD="${PGPASSWORD}"

echo "===== Applying schema.sql ====="
psql -h db -U postgres -d example -f sql/init/schema.sql
echo "===== Schema applied. ====="

echo "===== Applying data.sql ====="
psql -h db -U postgres -d example -f sql/load/data.sql
echo "===== Data loaded. ====="

echo "===== All migrations completed! ====="
