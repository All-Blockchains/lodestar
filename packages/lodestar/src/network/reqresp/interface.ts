import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {RequestId, RequestBody, ResponseBody} from "@chainsafe/lodestar-types";
import {ILogger} from "@chainsafe/lodestar-utils";
import {Method, Methods, ReqRespEncoding} from "../../constants";
import {IPeerMetadataStore, IRpcScoreTracker} from "../peers";

export interface IReqRespModules {
  config: IBeaconConfig;
  libp2p: LibP2p;
  logger: ILogger;
  peerMetadata: IPeerMetadataStore;
  peerRpcScores: IRpcScoreTracker;
}

export type ReqRespRequest<Body extends RequestBody | null = null> = {
  method: Method;
  id: RequestId;
  body: Body;
  encoding: ReqRespEncoding;
};

export type RequestOrResponseType = Exclude<
  ReturnType<typeof Methods[Method]["responseSSZType"]> | ReturnType<typeof Methods[Method]["requestSSZType"]>,
  null
>;

export type RequestOrResponseBody = ResponseBody | RequestBody;

/**
 * Stream types from libp2p.dialProtocol are too vage and cause compilation type issues
 * These source and sink types are more precise to our usage
 */
export interface ILibP2pStream {
  source: AsyncIterable<Buffer>;
  sink: (source: AsyncIterable<Buffer>) => Promise<void>;
  close: () => void;
  reset: () => void;
}
