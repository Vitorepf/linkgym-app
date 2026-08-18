import "react-native-gesture-handler";
import { registerRootComponent } from "expo";

import App from "./App";

// Sem EXPO_PUBLIC_SHOT o bundler elimina o require inteiro (verificado: o bundle de
// produção fica 17,5 kB menor e sem nenhuma string de fixture). Exporte SEMPRE com --clear:
// o cache do Metro guarda o valor inlinado da env e envenena o export seguinte.
if (process.env.EXPO_PUBLIC_SHOT) {
  registerRootComponent(require("./tools/shotHost").ShotHost);
} else {
  registerRootComponent(App);
}
