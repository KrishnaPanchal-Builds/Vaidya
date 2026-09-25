"""
TraumaBridge AI — .proto File for Protobuf Telemetry Packets

Used for MQTT low-bandwidth telemetry transport (store-and-forward).
Compile with: python -m grpc_tools.protoc -I=proto --python_out=app/proto proto/telemetry.proto

See backend_blueprint.md §4.1.1 for full field documentation.
"""
