import { Model } from "sequelize";

import { isArray } from "~/shared/common/utils/validation";

export function removeNulls(obj: any): any {
  if (obj === null) {
    return undefined;
  }

  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] instanceof Model) {
        obj[i] = obj[i].get({ plain: true });
      }
    }
  }

  if (typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (obj[key] instanceof Model) {
        obj[key] = obj[key].get({ plain: true });
      } else if (obj[key] === null) {
        obj[key] = undefined;
      } else if (isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          if (obj[i] instanceof Model) {
            obj[i] = obj[i].get({ plain: true });
          }
        }
      }
    }
  }

  return obj;
}
