import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Alert } from "react-native";

import CalcContext from "../../../context/CalcContext";
import Button from "../../../components/Button";
import Textfield from "../../../components/Textfield";
import FormPicker from "../../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../../constants";
import Modal from "../../../components/ResultModal";
import CountContext from "../../../context/CountContext";

type Value = {
  light?: string;
  socketNumber?: number;
  firePump?: string;
  pump?: {
    quantity?: number;
    load?: string;
  };
  fan?: {
    quantity?: number;
    load?: string;
  };
  condition?: {
    quantity?: number;
    load?: string;
  };
  heater?: {
    quantity?: number;
    load?: string;
  };
  lift?: {
    quantity?: number;
    load?: string;
  };
  technology?: {
    quantity?: number;
    load?: string;
  };
  cable: "AC1" | "AC2";
  floor: boolean;
};
type Error = {
  light?: boolean;
  socketNumber?: boolean;
  firePump?: boolean;
  pump?: boolean;
  fan?: boolean;
  condition?: boolean;
  heater?: boolean;
  lift?: boolean;
  technology?: boolean;
  cable?: boolean;
  floor?: boolean;
};
type Plumb = {
  lessThanOne: number;
  oneToFour: number;
  moreThanOne: number;
};
type ErrPlumb = {
  lessThanOne?: boolean;
  oneToFour?: boolean;
  moreThanOne?: boolean;
};

const OfficeCalculatorScreen: FC = () => {
  const calcContext = useContext(CalcContext);
  const { increase } = useContext(CountContext);
  // Гол өгөгдлүүд...
  const [value, setValue] = useState<Value>({
    cable: "AC1",
    floor: false,
  });
  const [lightpowerFactorIn, setLightpowerFactorIn] = useState<number>(0.92);
  const [buildingType, setBuildingType] = useState<string>("0");

  // Сантехникийн төхөөрөмжийн чадал, error state...
  const [plumb, setPlumb] = useState<Plumb>({
    lessThanOne: 0,
    moreThanOne: 0,
    oneToFour: 0,
  });
  const [errPlumb, setErrPlumb] = useState<ErrPlumb>({});
  const [pcy, setPcy] = useState<number>();
  const [uldegdelPlumb, setUldegdelPlumb] = useState<number>(100);

  // Туслах өгөгдлүүд...
  const [error, setError] = useState<Error>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  // Тооцооны эцсийн үр дүн...
  const [result, setResult] = useState<any>([]);
  const [section, setSection] = useState<string | number>();
  const [resultEmergency, setResultEmergency] = useState<any>();
  const [sectionFire, setSectionFire] = useState<string | number>();

  // Таблицууд...
  // Pсг -ээс Pтг олдог таблицууд...
  const numberTabLight = [5, 10, 15, 25, 50, 100, 200, 400, 500];
  const coeffLight0 = [1, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.3, 0.3];
  const coeffLight1 = [1, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.5];
  const coeffLight2345611 = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6];
  const coeffLight7 = [1, 1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65];
  const coeffLight9 = [1, 0.9, 0.8, 0.75, 0.7, 0.65, 0.55, 0.55, 0.55];
  const coeffLight10 = [1, 0.9, 0.8, 0.7, 0.65, 0.6, 0.5, 0.5, 0.5];

  //  K коэффициент [20-75%, 75-140%, 140-250%]...
  const k6condition = [0.85, 0.75, 0.85];
  const k6 = [0.9, 0.85, 0.9];
  const k23 = [0.95, 0.9, 0.95];
  const k1 = [0.85, 0.8, 0.85];
  const k5891011 = [0.85, 0.75, 0.85];
  const k47 = [0.95, 0.9, 0.95];
  const k47condition = [0.85, 0.75, 0.85];

  //   Options...
  const cables = [
    { label: "АВБбШв", value: "AC1" },
    { label: "АВВГ", value: "AC2" },
    { label: "ВВГ", value: "CC1" },
    { label: "КГ", value: "CC2" },
  ];
  const lightTypesOptions = [
    { label: "Цахилах чийдэнтэй", value: 0.92 },
    { label: "Улайсах чийдэнтэй", value: 1 },
    { label: "LED чийдэнтэй", value: 0.95 },
  ];
  const buildingTypeOptions = [
    { label: "Зочид буудал, амралтын газар", value: "0" },
    { label: "Хүүхдийн цэцэрлэг", value: "1" },
    { label: "МСҮТ", value: "2" },
    { label: "ЕБС", value: "3" },
    { label: "Захригаа, санхүү, улсын даатгалын газрууд", value: "4" },
    { label: "Ахуйн үйлчилгээ, үсчин", value: "5" },
    { label: "Худалдааны газрууд", value: "6" },
    { label: "Зураг төсөл, зохион бүтээх, эрдэм шинжилгээ", value: "7" },
    { label: "Спорт заал", value: "8" },
    { label: "Клуб, соёлын ордон", value: "9" },
    { label: "Кино театр", value: "10" },
    { label: "Номын сан", value: "11" },
  ];

  // ######################## FORM-ТОЙ АЖИЛЛАХ ФУНКЦУУД #############################
  const reset = () => {
    setValue({
      floor: false,
      cable: "AC1",
    });
    setResult(undefined);
    setResultEmergency(undefined);
    setSection(undefined);
    setSectionFire(undefined);
    setVisible(false);
  };

  useEffect(() => {
    // Товч идэвхитэй, идэвхигүйг тодорхойлно.
    let disabled = true;
    disabled = !Object.values(error).every((el) => el !== true);
    if (!value.light) {
      disabled = true;
    } else {
      // Аль нэг нь байхгүй бол идэвхигүй болгох...
      if (
        (value.fan?.load && !value.fan.quantity) ||
        (!value.fan?.load && value.fan?.quantity)
      )
        disabled = true;
      else if (
        (value.heater?.load && !value.heater.quantity) ||
        (!value.heater?.load && value.heater?.quantity)
      )
        disabled = true;
      else if (
        (value.pump?.load && !value.pump.quantity) ||
        (!value.pump?.load && value.pump?.quantity)
      )
        disabled = true;
      else if (
        (value.condition?.load && !value.condition.quantity) ||
        (!value.condition?.load && value.condition?.quantity)
      )
        disabled = true;
      else if (
        (value.technology?.load && !value.technology.quantity) ||
        (!value.technology?.load && value.technology?.quantity)
      )
        disabled = true;
      else if (
        (value.lift?.load && !value.lift.quantity) ||
        (!value.lift?.load && value.lift?.quantity)
      )
        disabled = true;
      else disabled = false;
    }

    // disabled хувьсагчийн утгыг өглөө...
    setDisabled(disabled);
  }, [value, error]);

  // Input утга олгох...
  const valueChanger = (
    text: string,
    id: keyof Value | [keyof Value, "quantity"],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;
    if (text !== "") {
      const number = parseInt(text);
      if (validation) {
        if (number < validation[0] || validation[1] < number) {
          setError((state) => {
            state[key] = true;
            return state;
          });
        } else {
          setError((state) => {
            state[key] = false;
            return state;
          });
        }
      } else {
        setError((state) => {
          state[key] = false;
          return state;
        });
      }

      if (key === "floor") {
        if (number > 11) {
          setValue((state) => {
            const copy = { ...state };
            copy[key] = true;

            return copy;
          });
        } else {
          setValue((state) => {
            const copy = { ...state };
            copy[key] = false;

            return copy;
          });
        }
      } else {
        if (
          key === "heater" ||
          key === "pump" ||
          key === "fan" ||
          key === "lift" ||
          key === "condition" ||
          key === "technology"
        ) {
          setValue((value) => {
            const copy: any = { ...value };
            if (typeof id === "object") {
              if (!copy[key]) copy[key] = {};

              copy[key].quantity = number;
            }

            return copy;
          });
        } else {
          setValue((value) => {
            const copy: any = { ...value };
            copy[key] = number;

            return copy;
          });
        }
      }
    } else {
      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = undefined;

        return copy;
      });
    }
  };

  // Бутархай тоон утга оруулах...
  const valueChangerButarhai = (
    text: string,
    id: keyof Value | [keyof Value, "load"],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;
    if (text !== "") {
      const number = text;
      if (validation) {
        if (
          parseFloat(number) < validation[0] ||
          validation[1] < parseFloat(number)
        ) {
          setError((state) => {
            state[key] = true;
            return state;
          });
        } else {
          setError((state) => {
            state[key] = false;
            return state;
          });
        }
      } else {
        setError((state) => {
          state[key] = false;
          return state;
        });
      }

      if (
        key === "heater" ||
        key === "pump" ||
        key === "fan" ||
        key === "lift" ||
        key === "condition" ||
        key === "technology"
      ) {
        setValue((value) => {
          const copy: any = { ...value };
          if (typeof id === "object") {
            if (!copy[key]) copy[key] = {};

            copy[key].load = number;
          }

          return copy;
        });
      } else {
        setValue((value) => {
          const copy: any = { ...value };
          copy[key] = number;

          return copy;
        });
      }
    } else {
      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = undefined;

        return copy;
      });
    }
  };

  const plumbChanger = (
    text: string,
    id:
      | keyof Plumb
      | [keyof Plumb, "lessThanOne" | "oneToFour" | "moreThanFour"],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;
    if (text !== "") {
      const number = parseInt(text);
      if (id === "lessThanOne") {
        const sum = plumb.moreThanOne + plumb.oneToFour + number;
        if (sum > 100) {
          setErrPlumb((err) => {
            const copy = { ...err };
            copy.lessThanOne = true;
            return copy;
          });
        } else {
          setErrPlumb((err) => {
            const copy = { ...err };
            copy.lessThanOne = false;
            return copy;
          });
        }
      } else if (id === "moreThanOne") {
        const sum = plumb.lessThanOne + plumb.oneToFour + number;
        if (sum > 100) {
          setErrPlumb((err) => {
            const copy = { ...err };
            copy.moreThanOne = true;
            return copy;
          });
        } else {
          setErrPlumb((err) => {
            const copy = { ...err };
            copy.moreThanOne = false;
            return copy;
          });
        }
      } else {
        const sum = plumb.lessThanOne + plumb.moreThanOne + number;
        if (sum > 100) {
          setErrPlumb((err) => {
            const copy = { ...err };
            copy.oneToFour = true;
            return copy;
          });
        } else {
          setErrPlumb((err) => {
            const copy = { ...err };
            copy.oneToFour = false;
            return copy;
          });
        }
      }
      // утга олгох хэсэг (Сантехник)
      setPlumb((value) => {
        const copy: any = { ...value };
        copy[key] = number;

        return copy;
      });
    } else {
      setPlumb((value) => {
        const copy: any = { ...value };
        copy[key] = 0;

        return copy;
      });
    }
  };

  // ######################## ГОЛ ФУНКЦУУД #############################
  const calc = async () => {
    if (
      buildingType === "6" &&
      plumb.lessThanOne + plumb.moreThanOne + plumb.oneToFour !== 100
    ) {
      Alert.alert(
        "Анхаар!",
        "Сантехникийн ачааллын эзлэх хувиудын нийлбэр 100%-тай тэнцүү байх шаардлагатай!",
        [
          {
            text: "Ойлгосон",
            onPress: () => {},
            style: "cancel",
          },
        ]
      );
    } else {
      if (calcContext) {
        // Хувьсагчид...
        const lightNominalLoad = value.light ? parseFloat(value.light) : 0;
        const socketNum = value.socketNumber ? value.socketNumber : 0;
        let lightCoeff = 1;
        let socketCoeff = 0;
        // Сантехникийн ачаа...
        let plumbLoadNominal = 0;
        let plumbNum = 0;
        // Хөргүүрийн ачаа ...
        const conditionNum = value.condition?.quantity;
        const conditionLoadNominal =
          value.condition && value.condition.load
            ? parseFloat(value.condition.load)
            : 0;
        // Лифтний ачаа, тоо...
        const elevatorNum = value.lift?.quantity;
        const elevatorNominalLoad =
          value.lift && value.lift.load ? parseFloat(value.lift.load) : 0;
        // Технологийн тоо, ачаалал...
        const techNominalLoad =
          value.technology && value.technology.load
            ? parseFloat(value.technology.load)
            : 0;
        const techNumber = value.technology?.quantity;
        let coeffTech = 0;
        // General...
        let k = 0;
        let k1cond = 0;

        // Розетканы чадал...
        if (
          buildingType === "0" ||
          buildingType === "5" ||
          buildingType === "6" ||
          buildingType === "10" ||
          buildingType === "11"
        )
          socketCoeff = 0.2;
        else socketCoeff = 0.1;

        const socketNominalLoad = socketNum * 0.06;

        // Гэрэлтүүлгийн чадал...
        if (lightNominalLoad < 5) lightCoeff = 1;
        else if (buildingType === "0") {
          if (lightNominalLoad > 500) lightCoeff = 0.3;
          else
            lightCoeff = calcContext.interpolation(
              lightNominalLoad,
              numberTabLight,
              coeffLight0
            );
        } else if (buildingType === "1") {
          if (lightNominalLoad > 500) lightCoeff = 0.5;
          else
            lightCoeff = calcContext.interpolation(
              lightNominalLoad,
              numberTabLight,
              coeffLight1
            );
        } else if (
          buildingType === "2" ||
          buildingType === "3" ||
          buildingType === "4" ||
          buildingType === "5" ||
          buildingType === "11" ||
          buildingType === "6"
        ) {
          if (lightNominalLoad > 500) lightCoeff = 0.6;
          else
            lightCoeff = calcContext.interpolation(
              lightNominalLoad,
              numberTabLight,
              coeffLight2345611
            );
        } else if (buildingType === "7") {
          if (lightNominalLoad > 500) lightCoeff = 0.65;
          else
            lightCoeff = calcContext.interpolation(
              lightNominalLoad,
              numberTabLight,
              coeffLight7
            );
        } else if (buildingType === "8") lightCoeff = 1;
        else if (buildingType === "9") {
          if (lightNominalLoad > 500) lightCoeff = 0.55;
          else
            lightCoeff = calcContext.interpolation(
              lightNominalLoad,
              numberTabLight,
              coeffLight9
            );
        } else if (buildingType === "10") {
          if (lightNominalLoad > 500) lightCoeff = 0.5;
          else
            lightCoeff = calcContext.interpolation(
              lightNominalLoad,
              numberTabLight,
              coeffLight10
            );
        }

        // Сангийн суурилагдсан ачаалал...
        if (value.fan?.load && value.heater?.load && value.pump?.load)
          plumbLoadNominal =
            parseFloat(value.fan.load) +
            parseFloat(value.heater.load) +
            parseFloat(value.pump.load);
        else if (!value.fan?.load && value.heater?.load && value.pump?.load)
          plumbLoadNominal =
            parseFloat(value.heater.load) + parseFloat(value.pump.load);
        else if (value.fan?.load && !value.heater?.load && value.pump?.load)
          plumbLoadNominal =
            parseFloat(value.fan.load) + parseFloat(value.pump.load);
        else if (value.fan?.load && value.heater?.load && !value.pump?.load)
          plumbLoadNominal =
            parseFloat(value.fan.load) + parseFloat(value.heater.load);
        else if (value.fan?.load && !value.heater?.load && !value.pump?.load)
          plumbLoadNominal = parseFloat(value.fan.load);
        else if (!value.fan?.load && value.heater?.load && !value.pump?.load)
          plumbLoadNominal = parseFloat(value.heater.load);
        else if (!value.fan?.load && !value.heater?.load && value.pump?.load)
          plumbLoadNominal = parseFloat(value.pump.load);

        // Сангийн нийт тоо...
        if (
          value.fan?.quantity &&
          value.heater?.quantity &&
          value.pump?.quantity
        )
          plumbNum =
            value.fan.quantity + value.heater.quantity + value.pump.quantity;
        else if (
          !value.fan?.quantity &&
          value.heater?.quantity &&
          value.pump?.quantity
        )
          plumbNum = value.heater.quantity + value.pump.quantity;
        else if (
          value.fan?.quantity &&
          !value.heater?.quantity &&
          value.pump?.quantity
        )
          plumbNum = value.fan.quantity + value.pump.quantity;
        else if (
          value.fan?.quantity &&
          value.heater?.quantity &&
          !value.pump?.quantity
        )
          plumbNum = value.fan.quantity + value.heater.quantity;
        else if (
          value.fan?.quantity &&
          !value.heater?.quantity &&
          !value.pump?.quantity
        )
          plumbNum = value.fan.quantity;
        else if (
          !value.fan?.quantity &&
          value.heater?.quantity &&
          !value.pump?.quantity
        )
          plumbNum = value.heater.quantity;
        else if (
          !value.fan?.quantity &&
          !value.heater?.quantity &&
          value.pump?.quantity
        )
          plumbNum = value.pump.quantity;
        // Сангийн болон лифтний коэффициентүүд...
        const coeffPlumb = calcContext.calcPlumbCoeff(plumbNum);
        const coeffCondition = conditionNum
          ? calcContext.calcPlumbCoeff(conditionNum)
          : 1;
        const coeffElevator = elevatorNum
          ? calcContext.elevatorCoeff(elevatorNum, value.floor)
          : 0.8;
        // Технологийн тоног төхөөрөмжийн коэффициент...
        if (buildingType === "5" || buildingType === "6") {
          if (value.technology?.quantity && value.technology.quantity < 5)
            coeffTech = 0.6;
          else if (value.technology?.quantity && value.technology.quantity > 4)
            coeffTech = 0.3;
        } else if (buildingType === "3") {
          if (value.technology?.quantity && value.technology.quantity < 5)
            coeffTech = 0.4;
          else if (value.technology?.quantity && value.technology.quantity > 4)
            coeffTech = 0.15;
        } else {
          if (value.technology?.quantity && value.technology.quantity < 5)
            coeffTech = 1;
          else if (value.technology?.quantity && value.technology.quantity > 4)
            coeffTech = calcContext.calcPlumbCoeff(value.technology.quantity);
        }

        // ### ХЭСЭГ ТУС БҮРИЙН ТООЦООНЫ АЧААНУУД ###
        // Гэрэлтүүлгийн тооцооны чадал нь :
        const lightLoad = lightNominalLoad * lightCoeff;
        // Розетканы тооцооны чадал...
        const socketLoad = socketNominalLoad * socketCoeff;
        // Сантехникийн тооцооны чадал нь :
        const plumbLoad = plumbLoadNominal * coeffPlumb;
        // Хөргөх төхөөрөмжийн тооцооны чадал нь :
        const conditionLoad = conditionLoadNominal
          ? conditionLoadNominal * coeffCondition
          : 0;
        // Лифтний тооцооны чадал нь :
        const elevatorLoad = elevatorNominalLoad
          ? elevatorNominalLoad * coeffElevator
          : 0;
        // Технологийн төхөөрөмжийн ачаалал...
        const techLoad = techNominalLoad ? techNominalLoad * coeffTech : 0;

        // ### Оролтын тооцоо... ###
        const hurt = lightLoad + socketLoad;
        const huw = plumbLoad + conditionLoad + elevatorLoad + techLoad;
        const haritsaa = (100 * hurt) / huw;
        const gerelConditionHaritsaa = (100 * lightLoad) / conditionLoad;
        const k1key = [15, 20, 50, 100, 150];
        const k1value = [1, 0.8, 0.6, 0.4, 0.2];

        // K коэфф буцаадаг функц...
        const coeffReturn = (arr: number[]) => {
          if (haritsaa > 19 && haritsaa < 76) return arr[0];
          else if (haritsaa > 75 && haritsaa < 141) return arr[1];
          else if (haritsaa > 140 && haritsaa < 251) return arr[2];
          else return 1;
        };

        // K коэфф тодорхойлох хэсэг... Энэ нь coeffReturn функцийг хэрэглэдэг...
        if (buildingType === "1") k = coeffReturn(k1);
        else if (buildingType === "2" || buildingType === "3")
          k = coeffReturn(k23);
        else if (buildingType === "6") {
          if (!value.condition?.quantity || !value.condition.load)
            k = coeffReturn(k6);
          else if (value.condition.quantity && value.condition.load)
            k = coeffReturn(k6condition);
        } else if (buildingType === "4" || buildingType === "7") {
          if (!value.condition?.quantity || !value.condition.load)
            k = coeffReturn(k47);
          else if (value.condition.quantity && value.condition.load)
            k = coeffReturn(k47condition);
        } else k = coeffReturn(k5891011);

        // Condition-ын коэффициент...
        if (gerelConditionHaritsaa < 15) k1cond = 1;
        else if (gerelConditionHaritsaa > 150) k1cond = 0.2;
        else
          k1cond = calcContext.interpolation(
            gerelConditionHaritsaa,
            k1key,
            k1value
          );

        const cond = k1cond * conditionLoad;

        setPcy(() => {
          if (value.heater?.load)
            return plumbLoad + conditionLoad - parseFloat(value.heater.load);
          else return plumbLoad + conditionLoad;
        });

        // ### ТООЦООНЫ ЧАДАЛ ###...
        const power =
          k *
          (lightLoad + socketLoad + plumbLoad + elevatorLoad + techLoad + cond);

        // ### Cosф сонгох тооцоо... ###
        let pfSocketWithPower = 0;
        let pfPlumb = 0;
        const pfLight = lightpowerFactorIn;
        const pfElevator = 0.65;
        const pfHeater = 0.98;

        if (buildingType !== "6") {
          pfPlumb = 0.8;

          if (buildingType === "1") pfSocketWithPower = 0.98;
          else if (
            buildingType === "0" ||
            buildingType === "2" ||
            buildingType === "8" ||
            buildingType === "11"
          )
            pfSocketWithPower = 0.9;
          else if (buildingType === "3") pfSocketWithPower = 0.95;
          else if (
            buildingType === "4" ||
            buildingType === "5" ||
            buildingType === "7"
          )
            pfSocketWithPower = 0.85;
          else if (buildingType === "9" || buildingType === "10")
            pfSocketWithPower = 0.92;
        } else {
          pfSocketWithPower = 0.85;

          // Сантехникийн cosф ольё...
          const plumbLoadCos = pcy ? pcy : 0;
          const plumbLoadtoOne = (plumb.lessThanOne * plumbLoadCos) / 100;
          const plumbLoadOneToFour = (plumb.oneToFour * plumbLoadCos) / 100;
          const plumbLoadToFour = (plumb.moreThanOne * plumbLoadCos) / 100;

          const urjwer1 = plumbLoadtoOne * 0.65;
          const urjwer2 = plumbLoadOneToFour * 0.75;
          const urjwer3 = plumbLoadToFour * 0.85;
          const hurtwer = urjwer1 + urjwer2 + urjwer3;

          pfPlumb = hurtwer / plumbLoadCos;
        }

        // Context руу дамжуулах ачаа, Cosф...
        const plumbContext = value.heater?.load
          ? conditionLoad + plumbLoad - parseFloat(value.heater.load)
          : conditionLoad + plumbLoad;

        const heaterContext = value.heater?.load
          ? parseFloat(value.heater.load)
          : 0;
        const userPowerContext = socketLoad + techLoad;

        let loadToContext = [
          lightLoad,
          plumbContext,
          heaterContext,
          userPowerContext,
          elevatorLoad,
        ];
        let pfToContext = [
          pfLight,
          pfPlumb,
          pfHeater,
          pfSocketWithPower,
          pfElevator,
        ];

        const {
          current,
          burenChadal,
          powerFactor,
          circuitBreakerCurrent,
          wireCable,
        } = calcContext.currentCalc(
          power,
          loadToContext,
          pfToContext,
          value.cable
        );

        setResult([
          power,
          current,
          burenChadal,
          powerFactor,
          circuitBreakerCurrent,
        ]);
        setSection(wireCable);

        // Ослын үеийн тооцоо...
        if (value.firePump) {
          const firePumpLoadValue = value.firePump;
          const pfEmergencyToContext = [0.8];
          const loadEmergencyToContext = [parseFloat(firePumpLoadValue)];

          const emergencyResult = calcContext?.currentCalc(
            parseFloat(firePumpLoadValue),
            loadEmergencyToContext,
            pfEmergencyToContext,
            "CCF"
          );
          const turEmerRes = Object.entries(emergencyResult);
          let sectionEmerRes = turEmerRes[turEmerRes.length - 1][1];
          turEmerRes.splice(1, 2);
          turEmerRes.splice(turEmerRes.length - 1, 1);

          setResultEmergency([
            firePumpLoadValue,
            ...turEmerRes.map((e) => e[1]),
          ]);
          setSectionFire(sectionEmerRes);
        }
      }

      setVisible(true);
    }

    await increase();
  };

  return (
    <ScrollView style={css.container}>
      <Modal
        visible={visible}
        setVisible={setVisible}
        title="Тооцооны хариу"
        reset={reset}
      >
        <Text style={css.subtitle}>Өгөгдөл</Text>
        {(() => {
          const data = [
            {
              label: "Гэрэлтүүлгийн суурилагдсан чадал",
              value: value.light,
              unit: "кВт",
            },
            {
              label: "Розетканы тоо",
              value: value.socketNumber,
              unit: "ш",
            },
            {
              label: "Сэнсний суурилагдсан чадал",
              value: value.fan?.load,
              unit: "кВт",
            },
            {
              label: "Насосны суурилагдсан чадал",
              value: value.pump?.load,
              unit: "кВт",
            },
            {
              label: "Халаагчийн суурилагдсан чадал",
              value: value.heater?.load,
              unit: "кВт",
            },
            {
              label: "Хөргөх төхөөрөмжийн чадал",
              value: value.condition?.load,
              unit: "кВт",
            },
            {
              label: "Галын насос, сэнсний суурилагдсан чадал",
              value: value.firePump,
              unit: "кВт",
            },
            {
              label: "Лифтний суурилагдсан чадал",
              value: value.lift?.load,
              unit: "кВт",
            },
          ];
          return (
            <>
              {data
                .filter((item) => item.value !== undefined)
                .map(({ label, value, unit }, i) => (
                  <View key={i} style={css.modalItem}>
                    <Text
                      style={{
                        flexDirection: "row",
                        width: "90%",
                        flexWrap: "wrap",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: w400,
                          color: main,
                          marginRight: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        {label}:{" "}
                      </Text>
                      <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                        {value} {unit}
                      </Text>
                    </Text>
                  </View>
                ))}
            </>
          );
        })()}
        <Text style={css.subtitle}>Үр дүн</Text>
        {(() => {
          const data = [
            {
              label: "Тооцооны чадал",
              unit: "кВт",
            },
            {
              label: "Тооцооны гүйдэл",
              unit: "А",
            },
            {
              label: "Бүрэн чадал, кВА",
              unit: "кВА",
            },
            {
              label: "Дундаж чадлын коэффициент",
              unit: null,
            },
            {
              label: "Автомат таслуурын гүйдэл",
              unit: "A",
            },
            {
              label: "Кабель",
              value: `${
                cables.find((item) => item.value === value.cable)?.label
              } ${section}`,
            },
          ];
          return (
            <>
              {data.map(({ label, unit, value }, i) => {
                return (
                  <View key={i} style={css.modalItem}>
                    <Text
                      style={{
                        flexDirection: "row",
                        width: "90%",
                        flexWrap: "wrap",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: w400,
                          color: main,
                          marginRight: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        {label}:{" "}
                      </Text>
                      {value && (
                        <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                          {value}
                        </Text>
                      )}
                      {result && (
                        <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                          {result[i] && Math.round(result[i] * 1000) / 1000}{" "}
                          {unit}
                        </Text>
                      )}
                    </Text>
                  </View>
                );
              })}
            </>
          );
        })()}
        <Text style={css.subtitle}>Галын үед ажиллах төхөөрөмжүүд</Text>
        {(() => {
          const data = [
            {
              label: "Суурилагдсан чадал",
              unit: " кВт",
            },
            {
              label: "Хэвийн гүйдэл",
              unit: "A",
            },
            {
              label: "Автомат таслуурын гүйдэл",
              unit: "A",
            },
          ];
          return value.firePump ? (
            <View>
              <View style={css.modalItem}>
                <Text style={{ fontFamily: w400, color: main, marginRight: 5 }}>
                  ЦХНА-ны зэрэглэл :
                </Text>
                <Text style={{ fontFamily: w400 }}>I</Text>
              </View>
              {data.map(({ label, unit }, i) => {
                if (resultEmergency && resultEmergency[i]) {
                  return (
                    <View key={i} style={css.modalItem}>
                      <Text
                        style={{
                          fontFamily: w400,
                          color: main,
                          marginRight: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        {label}:
                      </Text>
                      <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                        {Math.round(resultEmergency[i] * 100) / 100} {unit}
                      </Text>
                    </View>
                  );
                }
              })}
              <View style={css.modalItem}>
                <Text style={{ fontFamily: w400, color: main, marginRight: 5 }}>
                  Кабель :
                </Text>
                <Text style={{ fontFamily: w400 }}>
                  ВВГнг-(A)-LS {sectionFire}
                </Text>
              </View>
            </View>
          ) : null;
        })()}
      </Modal>
      <Text style={css.title}>Гэрэлтүүлэг, розетканы өгөгдөл</Text>
      <FormPicker
        label="Барилгын зориулалт"
        icon="blur"
        options={buildingTypeOptions}
        onValueChange={(value) => {
          setBuildingType(value);
        }}
        value={buildingType ? buildingType + "" : "0"}
      />
      <FormPicker
        label="Барилга доторх ихэнх гэрэлтүүлэгч :"
        icon="blur"
        options={lightTypesOptions}
        onValueChange={(value) => {
          setLightpowerFactorIn(parseFloat(value));
        }}
        value={lightpowerFactorIn + ""}
      />
      <Textfield
        label="Барилгын давхрын тоог оруулна уу"
        placeholder="24-өөс бага тоо оруулна уу"
        icon="office-building"
        keyboardType="numeric"
        onChangeText={(value) => valueChanger(value, "floor", [1, 24])}
        error={{
          text: "Та 1-24 хүртэлх бүхэл тоо оруулна уу",
          show: error.floor,
        }}
      />
      <Textfield
        label="Гэрэлтүүлгийн суурилагдсан чадал (кВт)"
        placeholder="600кВт-аас бага тоо оруулна уу"
        icon="lightbulb-on"
        keyboardType="numeric"
        value={value.light ? value.light + "" : ""}
        onChangeText={(value) => valueChangerButarhai(value, "light", [1, 600])}
        error={{
          text: "Та 1-600 хүртэлх чадлын утга оруулна уу",
          show: error.light,
        }}
      />
      <Textfield
        style={{ marginBottom: 10 }}
        label="Розетканы тоо"
        placeholder="5000-аас бага тоо оруулна уу"
        icon="dots-horizontal-circle-outline"
        keyboardType="numeric"
        value={value.socketNumber ? value.socketNumber + "" : ""}
        onChangeText={(value) => valueChanger(value, "socketNumber", [1, 5000])}
        error={{
          text: "Та 1-5000 хүртэл бүхэл тоо оруулна уу",
          show: error.socketNumber,
        }}
      />
      {(() => {
        const sum = plumb.lessThanOne + plumb.moreThanOne + plumb.oneToFour;
        if (buildingType === "6") {
          return (
            <View>
              <Text style={css.title}>
                Халаагчаас бусад сантехникийн тоног төхөөрөмжүүдийн ачааллын
                ангилалаар нийт сантехникийн төхөөрөмжийн суурилагдсан ачаалалд
                эзлэх хувь
              </Text>
              <Textfield
                label="1 кВт хүртэлх чадалтай сантехникийн ачааллын эзлэх хувь"
                placeholder={
                  100 - sum > 0
                    ? `${100 - sum}% хүртэл утга оруулна уу`
                    : "3 утгийн нийлбэр 100% байх ёстой"
                }
                icon="chevron-left"
                keyboardType="numeric"
                value={plumb.lessThanOne ? plumb.lessThanOne + "" : ""}
                onChangeText={(value) =>
                  plumbChanger(value, "lessThanOne", [1, 100])
                }
                error={{
                  text: `Та 1-${
                    100 - (plumb.moreThanOne + plumb.oneToFour)
                  }% хүртэл утга оруулна уу`,
                  show: errPlumb.lessThanOne,
                }}
              />
              <Textfield
                label="1-4 кВт хүртэлх чадалтай сантехникийн ачааллын эзлэх хувь"
                placeholder={
                  100 - sum > 0
                    ? `${100 - sum}% хүртэл утга оруулна уу`
                    : "3 утгийн нийлбэр 100% байх ёстой"
                }
                icon="code-tags"
                keyboardType="numeric"
                disabled={plumb.lessThanOne + plumb.moreThanOne >= 100}
                value={plumb.oneToFour ? plumb.oneToFour + "" : ""}
                onChangeText={(value) =>
                  plumbChanger(value, "oneToFour", [
                    1,
                    uldegdelPlumb && plumb.lessThanOne !== 100
                      ? uldegdelPlumb
                      : 100,
                  ])
                }
                error={{
                  text: `Та 1-${
                    100 - (plumb.lessThanOne + plumb.moreThanOne)
                  }% хүртэл утга оруулна уу`,
                  show: errPlumb.oneToFour,
                }}
              />
              <Textfield
                label="4 кВт -аас дээш чадалтай сантехникийн ачааллын эзлэх хувь"
                placeholder={
                  100 - sum > 0
                    ? `${100 - sum}% хүртэл утга оруулна уу`
                    : "3 утгийн нийлбэр 100% байх ёстой"
                }
                icon="chevron-right"
                keyboardType="numeric"
                value={plumb.moreThanOne ? plumb.moreThanOne + "" : ""}
                disabled={plumb.lessThanOne + plumb.oneToFour >= 100}
                onChangeText={(value) =>
                  plumbChanger(value, "moreThanOne", [1, 100])
                }
                error={{
                  text: `Та 1-${
                    100 - (plumb.lessThanOne + plumb.oneToFour)
                  }% хүртэл утга оруулна уу`,
                  show: errPlumb.moreThanOne,
                }}
              />
            </View>
          );
        }
      })()}
      <Text style={{ ...css.title, marginTop: 15 }}>
        Хүчний төхөөрөмжийн өгөгдөл
      </Text>
      <Textfield
        label="Галын үед ажиллах сэнс, насосууд"
        placeholder="Нийт чадал, кВт"
        icon="fire-extinguisher"
        keyboardType="numeric"
        value={value.firePump ? value.firePump + "" : ""}
        onChangeText={(value) =>
          valueChangerButarhai(value, "firePump", [1, 200])
        }
        error={{
          text: "Та 1-200кВт хүртэл чадлын утга оруулна уу",
          show: error.firePump,
        }}
      />
      <Textfield
        label="Галын бус насоснууд"
        placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
        icon={["water-pump", "lightning-bolt"]}
        keyboardType="numeric"
        check
        value={[
          value.pump
            ? value.pump.quantity
              ? value.pump.quantity + ""
              : ""
            : "",
          value.pump ? (value.pump.load ? value.pump.load + "" : "") : "",
        ]}
        onChangeText={(value) =>
          valueChanger(value, ["pump", "quantity"], [1, 200])
        }
        checkChangeText={(value) =>
          valueChangerButarhai(value, ["pump", "load"], [1, 200])
        }
        error={{
          text: "Та 1-200кВт хүртэл чадлын утга оруулна уу",
          show: error.pump,
        }}
      />
      <Textfield
        label="Агааржуулах төхөөрөмжүүд"
        placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
        icon={["fan", "lightning-bolt"]}
        keyboardType="numeric"
        check
        value={[
          value.fan ? (value.fan.quantity ? value.fan.quantity + "" : "") : "",
          value.fan ? (value.fan.load ? value.fan.load + "" : "") : "",
        ]}
        onChangeText={(value) =>
          valueChanger(value, ["fan", "quantity"], [1, 200])
        }
        checkChangeText={(value) =>
          valueChangerButarhai(value, ["fan", "load"], [1, 200])
        }
        error={{
          text: "Та 1-200кВт хүртэл чадлын утга оруулна уу",
          show: error.fan,
        }}
      />
      <Textfield
        label="Хөргөх төхөөрөмжүүд (condition)"
        placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
        icon={["pump", "lightning-bolt"]}
        keyboardType="numeric"
        check
        value={[
          value.condition
            ? value.condition.quantity
              ? value.condition.quantity + ""
              : ""
            : "",
          value.condition
            ? value.condition.load
              ? value.condition.load + ""
              : ""
            : "",
        ]}
        onChangeText={(value) =>
          valueChanger(value, ["condition", "quantity"], [1, 200])
        }
        checkChangeText={(value) =>
          valueChangerButarhai(value, ["condition", "load"], [1, 200])
        }
        error={{
          text: "Та 1-200кВт хүртэл чадлын утга оруулна уу",
          show: error.condition,
        }}
      />
      <Textfield
        label="Агаар халаагч, цахилгаан халаах элементүүд"
        placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
        icon={["air-filter", "lightning-bolt"]}
        keyboardType="numeric"
        check
        value={[
          value.heater
            ? value.heater.quantity
              ? value.heater.quantity + ""
              : ""
            : "",
          value.heater ? (value.heater.load ? value.heater.load + "" : "") : "",
        ]}
        onChangeText={(value) =>
          valueChanger(value, ["heater", "quantity"], [1, 600])
        }
        checkChangeText={(value) =>
          valueChangerButarhai(value, ["heater", "load"], [1, 600])
        }
        error={{
          text: "Та 1-600кВт хүртэл чадлын утга оруулна уу",
          show: error.heater,
        }}
      />
      <Textfield
        label="Лифт"
        placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
        icon={["elevator-passenger", "lightning-bolt"]}
        keyboardType="numeric"
        check
        value={[
          value.lift
            ? value.lift.quantity
              ? value.lift.quantity + ""
              : ""
            : "",
          value.lift ? (value.lift.load ? value.lift.load + "" : "") : "",
        ]}
        onChangeText={(value) =>
          valueChanger(value, ["lift", "quantity"], [1, 200])
        }
        checkChangeText={(value) =>
          valueChangerButarhai(value, ["lift", "load"], [1, 200])
        }
        error={{
          text: "Та 1-200кВт хүртэл чадлын утга оруулна уу",
          show: error.lift,
        }}
      />
      <Textfield
        label="Тухайн барилгын үйл ажиллагаатай холбоотой технологийн тоног төхөөрөмжүүд"
        placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
        icon={["hammer-wrench", "lightning-bolt"]}
        keyboardType="numeric"
        check
        value={[
          value.technology
            ? value.technology.quantity
              ? value.technology.quantity + ""
              : ""
            : "",
          value.technology
            ? value.technology.load
              ? value.technology.load + ""
              : ""
            : "",
        ]}
        onChangeText={(value) =>
          valueChanger(value, ["technology", "quantity"], [1, 200])
        }
        checkChangeText={(value) =>
          valueChangerButarhai(value, ["technology", "load"], [1, 200])
        }
        error={{
          text: "Та 1-200кВт хүртэл чадлын утга оруулна уу",
          show: error.technology,
        }}
      />
      <FormPicker
        label="Кабелийн маяг"
        icon="google-circles-communities"
        options={cables}
        onValueChange={(value: any) => {
          setValue((state) => {
            const copyState = { ...state };
            copyState.cable = value;
            return copyState;
          });
        }}
        value={value.cable}
        style={{ marginTop: 10 }}
      />
      <Button disable={disabled} onPress={calc}>
        Тооцоолох
      </Button>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default OfficeCalculatorScreen;

const css = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  title: {
    fontFamily: w500,
    textTransform: "uppercase",
    fontSize: 16,
    color: main,
    marginLeft: 7,
    alignSelf: "center",
    paddingHorizontal: 3,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: w500,
    textTransform: "uppercase",
    fontSize: 16,
    color: dark,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: light,
    marginVertical: 3,
    padding: 7,
    borderRadius: 5,
  },
});
