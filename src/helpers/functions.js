//import { INITIAL_DATE } from "./types";
import i18n from "@/plugins/i18n";

class CommonFunction {

  showYesNo(val) {
    const { t: $t } = i18n.global;
    return val == 0 ? $t("no") : $t("yes");
  }

  showYesNoStr(val) {
    const { t: $t } = i18n.global;
    return val == 'N' ? $t("no") : $t("yes");
  }

  filterValue(obj, key, value) {
    return obj.find(v => v[key] === value);
  }

  nameToInitials(fullName) {
    const namesArray = fullName.trim().split(' ');
    if (namesArray.length === 1) {
      return namesArray[0].charAt(0);
    }
    return namesArray[0].charAt(0) +
           namesArray[namesArray.length - 1].charAt(0);
  }

  hasRole(roleList, roleName) {
    return roleList.includes(roleName);
  }
}

// 👇 EXPORT D’UNE INSTANCE UNIQUE
export default new CommonFunction();
