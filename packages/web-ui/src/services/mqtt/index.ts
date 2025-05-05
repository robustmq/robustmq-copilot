import { MQTTBrokerAdminServiceClient } from '@mbpb/AdminServiceClientPb';
import * as mqttAdminApi from '@mbpb/admin_pb';
import { QueryOption } from '../common';
import { getQueryOptions } from './util';

const service = new MQTTBrokerAdminServiceClient(process.env.PUBLIC_MQTT_SERVER, null, null);

export const getSessionList = async (query?: QueryOption): Promise<mqttAdminApi.ListSessionReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListSessionRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_session(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

export const getClientList = async (query?: QueryOption): Promise<mqttAdminApi.ListClientReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListClientRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_client(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};
