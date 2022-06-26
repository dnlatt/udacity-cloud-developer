import express from 'express';
import { Request, Response } from "express";
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {OK_STATUS_CODE,VALIDATION_ERROR_CODE,MESSAGE_IMAGE_PROCESS_ERROR,MESSAGE_IMAGE_EMPTY, HOME_MESSAGE} from './helpers/constants';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    // Validate Image URL
    let { image_url } : {image_url:string} = req.query;
    if (!image_url) {
      return res.status(VALIDATION_ERROR_CODE).send(MESSAGE_IMAGE_EMPTY);
    } else {

      // Try to filter image processing

      try {
        // Send the result image
        const filterImage = await filterImageFromURL(image_url.toString());
        res.status(OK_STATUS_CODE).sendFile(filterImage);

        // Delete files
        res.on('finish', () => deleteLocalFiles([filterImage]));
      } catch(err) {
        //Send error
        return res.status(VALIDATION_ERROR_CODE).send(MESSAGE_IMAGE_PROCESS_ERROR + err)
      }
    }
  } );


  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.status(OK_STATUS_CODE).send(HOME_MESSAGE)
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();