import { MQTTBrokerAdminServiceClient } from '@mbpb/AdminServiceClientPb';
import * as adminApi from '@mbpb/admin_pb';

const service = new MQTTBrokerAdminServiceClient(process.env.MQTT_SERVER, null, null);

interface ConnectionInfo {
  client_id: string;
  source_ip_addr: string;
  protocol: number;
}

export const fetchConnectionList = async (): Promise<ConnectionInfo[]> => {
  return new Promise((s, j) => {
    let req = new adminApi.ListConnectionRequest();

    service.mqtt_broker_list_connection(req, null, (err, response) => {
      if (err) {
        j(err);
      } else {
        const ret = response.toObject();
        s(
          ret.listConnectionRawList.map(i => {
            return {
              ...JSON.parse(i.info),
              protocol: i.protocol,
            };
          }),
        );
      }
    });
  });
};
