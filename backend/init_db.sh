CONTAINER_NAME="ClassMate_db"
DB_USER="postgres"                 
DB_NAME="example"               
SQL_DIR="./sql"                

# Find and execute each SQL file in the directory
for file_path in "$SQL_DIR"/init/*.sql; do
    file=$(basename $file_path)
    echo "Loading: $file into database $DB_NAME..."
    docker cp $file_path $CONTAINER_NAME:.
    docker exec -u $DB_USER $CONTAINER_NAME psql $DB_NAME $DB_USER -f $file
    echo "Loaded: $file"
done

echo "====================================="
echo "Finished loading init files"
echo "====================================="

for file_path in "$SQL_DIR"/load/*.sql; do
    file=$(basename $file_path)
    echo "Loading: $file into database $DB_NAME..."
    docker cp $file_path $CONTAINER_NAME:.
    docker exec -u $DB_USER $CONTAINER_NAME psql $DB_NAME $DB_USER -f $file
    echo "Loaded: $file"
done

echo "All SQL files processed."