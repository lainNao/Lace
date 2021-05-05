// const { remote } = require('electron');
import * as pathmodule from "path";

// const rootDir = (process.env.NODE_ENV === 'production')
//   ? remote.app.getPath('userData')
//   : "";

const rootDir = ""

export const DB_FILE_PATH = pathmodule.join(rootDir, "renderer/public/userdata/db/database.json");
export const PUBLIC_PATH =  pathmodule.join(rootDir, "renderer/public/");