import { PlacementCenterServiceClient } from '@pcpb/InnerServiceClientPb';
import * as innerApi from '@pcpb/inner_pb';

const service = new PlacementCenterServiceClient(process.env.PLACEMENT_CENTER, null, null);

export const fetchClusterStatus = async (): Promise<innerApi.ClusterStatusReply> => {
  return new Promise((s, j) => {
    service.clusterStatus(new innerApi.ClusterStatusRequest(), null, (err, response) => {
      if (err) {
        j(err);
      } else {
        const ret = response.getContent();
        s(JSON.parse(ret));
      }
    });
  });
};

export const fetchClusterNodeList = async (): Promise<innerApi.NodeListReply.AsObject> => {
  return new Promise((s, j) => {
    service.nodeList(new innerApi.NodeListRequest(), null, (err, response) => {
      if (err) {
        j(err);
      } else {
        const list = response.toObject();
        console.log(list.nodesList);
        s(list);
      }
    });
  });
};
