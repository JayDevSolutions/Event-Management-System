if [ ! "$(docker network ls | grep event-management-network)" ]; then
  echo "Creating event-management-network network ..."
  docker network create --driver bridge event-management-network
else
  echo "event-management-network network exists."
fi
