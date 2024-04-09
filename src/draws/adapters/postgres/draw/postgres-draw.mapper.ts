import { Draw } from "../../../entities/draw.entity";
import { PostgresDraw } from "./postgres-draw";

export class DrawMapper {
  toDomain({ id, title, organizerId, year }: PostgresDraw): Draw {
    return new Draw({
      id,
      title,
      organizerId,
      year,
    });
  }

  toPersistence(draw: Draw): PostgresDraw {
    const postgresDraw = new PostgresDraw();
    postgresDraw.id = draw.props.id;
    postgresDraw.title = draw.props.title;
    postgresDraw.organizerId = draw.props.organizerId;
    postgresDraw.year = draw.props.year;
    return postgresDraw;
  }
}
