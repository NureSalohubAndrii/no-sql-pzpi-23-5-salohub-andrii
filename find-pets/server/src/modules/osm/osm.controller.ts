import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/error.utils';
import * as osmService from './osm.service';

export const searchAddress: ExpressHandler = async (req, res) => {
  try {
    const data = await osmService.searchAddress(req.query.q as string);
    res.status(200).json(data);
  } catch (error) {
    handleError(res, error);
  }
};

export const reverseGeocoding: ExpressHandler = async (req, res) => {
  try {
    const data = await osmService.reverseGeocoding(Number(req.query.lon), Number(req.query.lat));
    res.status(200).json(data);
  } catch (error) {
    handleError(res, error);
  }
};
