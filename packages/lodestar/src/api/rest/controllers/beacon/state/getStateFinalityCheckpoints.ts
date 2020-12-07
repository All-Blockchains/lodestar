import {ApiController} from "../../types";
import {DefaultQuery} from "fastify";
import {FastifyError} from "fastify";
import {StateId} from "../../../../impl/beacon/state";

type Params = {
  stateId: StateId;
};

export const getStateFinalityCheckpoints: ApiController<DefaultQuery, Params> = {
  url: "/states/:stateId/finality_checkpoints",

  handler: async function (req, resp) {
    try {
      const state = await this.api.beacon.state.getState(req.params.stateId);
      if (!state) {
        return resp.status(404).send();
      }
      return resp.status(200).send({
        data: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          previous_justified: this.config.types.Checkpoint.toJson(state.previousJustifiedCheckpoint, {case: "snake"}),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          current_justified: this.config.types.Checkpoint.toJson(state.currentJustifiedCheckpoint, {case: "snake"}),
          finalized: this.config.types.Checkpoint.toJson(state.finalizedCheckpoint, {case: "snake"}),
        },
      });
    } catch (e) {
      if (e.message === "Invalid state id") {
        //TODO: fix when unifying errors
        throw {
          statusCode: 400,
          validation: [
            {
              dataPath: "state_id",
              message: e.message,
            },
          ],
        } as FastifyError;
      }
      throw e;
    }
  },

  opts: {
    schema: {
      params: {
        type: "object",
        required: ["stateId"],
        properties: {
          stateId: {
            types: "string",
          },
        },
      },
    },
  },
};
