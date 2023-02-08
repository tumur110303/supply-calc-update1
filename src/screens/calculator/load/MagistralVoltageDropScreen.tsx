import { FC, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Alert,
  Image,
  Dimensions,
} from "react-native";

import Button from "../../../components/Button";
import TextFieldThree from "../../../components/manyComponents/TextFieldThree";
import FormPicker from "../../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../../constants";
import Modal from "../../../components/ResultModal";
import TwoPicker from "../../../components/manyComponents/TwoPicker";
import CountContext from "../../../context/CountContext";

import Image1 from "../../../../assets/voltage-drop-img/01-1-removebg-preview.png";
import Image2 from "../../../../assets/voltage-drop-img/02-1-removebg-preview.png";
import Image3 from "../../../../assets/voltage-drop-img/03-1-removebg-preview.png";
import Image4 from "../../../../assets/voltage-drop-img/04-1-removebg-preview.png";
import Image5 from "../../../../assets/voltage-drop-img/05-1-removebg-preview.png";
import Image6 from "../../../../assets/voltage-drop-img/06-1-removebg-preview.png";

const { width } = Dimensions.get("window");

// #########################################  TYPE ########################################
type Value = {
  one: {
    load?: string;
    length?: string;
    sectionCable: number;
    coeff?: number;
  };
  two: {
    load?: string;
    length?: string;
    sectionCable: number;
    coeff?: number;
  };
  three: {
    load?: string;
    length?: string;
    sectionCable: number;
    coeff?: number;
  };
  four: {
    load?: string;
    length?: string;
    sectionCable: number;
    coeff?: number;
  };
  five: {
    load?: string;
    length?: string;
    sectionCable: number;
    coeff?: number;
  };
  six: {
    load?: string;
    length?: string;
    sectionCable: number;
    coeff?: number;
  };
};

type Voltage = {
  one: boolean;
  two?: boolean;
  three?: boolean;
  four?: boolean;
  five?: boolean;
  six?: boolean;
};

type Error = {
  one?: boolean;
  two?: boolean;
  three?: boolean;
  four?: boolean;
  five?: boolean;
  six?: boolean;
};

type Branch = string;

const MagistralVoltageDropScreen: FC = () => {
  const { increase } = useContext(CountContext);
  // ################################# VARIABLES ########################################
  // Шугамын урт, тухайн шугамын утасны хөндлөн огтлол...
  const [voltageThreePhase, setVoltageThreePhase] = useState<Voltage>({
    one: true,
  });
  const [value, setValue] = useState<Value>({
    one: {
      sectionCable: 2.5,
    },
    two: {
      sectionCable: 2.5,
    },
    three: {
      sectionCable: 2.5,
    },
    four: {
      sectionCable: 2.5,
    },
    five: {
      sectionCable: 2.5,
    },
    six: {
      sectionCable: 2.5,
    },
  });

  // Cable-ийн төрөл case : зэс эсвэл хөнгөнцагаан...
  const [cableType, setCableType] = useState<string>("CC1");
  const cables = [
    { label: "Зэс", value: "CC1" },
    { label: "Хөнгөнцагаан", value: "AC1" },
  ];

  // Салааны тоо...
  const [branchNumber, setBranchNumber] = useState<Branch>("1");
  // options deer branche руу дамжуулна...
  const branchNumberOption = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
  ];

  // Салааны фазын хүчдэлтэй хэсэг...
  const [phaseVoltageBranch, setPhaseVoltageBranch] = useState<Branch>("1");

  const sectionCableOption = [
    { label: "2.5мм.кв", value: 2.5 },
    { label: "4мм.кв", value: 4 },
    { label: "6мм.кв", value: 6 },
    { label: "10мм.кв", value: 10 },
    { label: "16мм.кв", value: 16 },
    { label: "25мм.кв", value: 25 },
    { label: "35мм.кв", value: 35 },
    { label: "50мм.кв", value: 50 },
    { label: "70мм.кв", value: 70 },
    { label: "95мм.кв", value: 95 },
    { label: "120мм.кв", value: 120 },
    { label: "150мм.кв", value: 150 },
    { label: "185мм.кв", value: 185 },
    { label: "240мм.кв", value: 240 },
  ];

  // Туслах state-үүд...
  const [error, setError] = useState<Error>({});
  const [disabled, setDisabled] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [achaaAldsan, setAchaaAldsan] = useState<boolean>(false);

  // Тооцооны сүүлчийн үр дүн...
  const [result, setResult] = useState<number | null>(0);

  // ############################### FORM ТОЙ АЖИЛЛАХ ФУНКЦ #############################
  const valueChanger = (
    text: string,
    id: keyof Value | [keyof Value, "length" | "sectionCable" | "load"],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;
    if (text !== "") {
      const number = text;

      // valueChanger доторх Error -ыг гаргаж ирэх кодны хэсэг...
      if (validation) {
        if (
          parseFloat(number) < validation[0] ||
          validation[1] < parseFloat(number)
        ) {
          id[1] == "load" ? setAchaaAldsan(true) : setAchaaAldsan(false);
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

      // value -д утга өгөх...
      if (
        key === "one" ||
        key === "two" ||
        key === "three" ||
        key === "four" ||
        key === "five" ||
        key === "six"
      ) {
        setValue((value) => {
          const copy = { ...value };
          if (typeof id === "object") {
            if (!copy[key])
              copy[key] = {
                sectionCable: 12,
              };

            if (id[1] === "length") {
              copy[key].length = number;
            } else if (id[1] === "load") {
              copy[key].load = number;
            } else {
              copy[key].sectionCable = parseInt(number);
            }
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
        const copy = { ...value };
        copy[key] = {
          sectionCable: 2.5,
        };

        return copy;
      });
    }
  };

  // Button идэвхгүй болгох эсэхийг шийдэх функц...
  const disableCheck = () => {
    const errors = !Object.values(error).every((err) => err === false);

    if (!errors) {
      setDisabled(false);
    }

    setDisabled(() => {
      if (branchNumber == "2")
        return (
          !value.one.load ||
          !value.one.length ||
          !value.two.load ||
          !value.two.length
        );

      if (branchNumber == "3")
        return (
          !value.one.load ||
          !value.one.length ||
          !value.two.load ||
          !value.two.length ||
          !value.three.load ||
          !value.three.length
        );

      if (branchNumber == "4")
        return (
          !value.one.load ||
          !value.one.length ||
          !value.two.load ||
          !value.two.length ||
          !value.three.load ||
          !value.three.length ||
          !value.four.load ||
          !value.four.length
        );

      if (branchNumber == "5")
        return (
          !value.one.load ||
          !value.one.length ||
          !value.two.load ||
          !value.two.length ||
          !value.three.load ||
          !value.three.length ||
          !value.four.load ||
          !value.four.length ||
          !value.five.load ||
          !value.five.length
        );

      if (branchNumber == "6")
        return (
          !value.one.load ||
          !value.one.length ||
          !value.two.load ||
          !value.two.length ||
          !value.three.load ||
          !value.three.length ||
          !value.four.load ||
          !value.four.length ||
          !value.five.load ||
          !value.five.length ||
          !value.six.load ||
          !value.six.length
        );

      return !value.one.load || !value.one.length;
    });

    if (errors) {
      setDisabled(true);
    }
  };

  useEffect(() => {
    disableCheck();
  }, [value, branchNumber, error]);

  // ################################ PARAMETER БЭЛТГЭХ ###############################
  // 380B уу үгүй юу гэдгийг тодорхойлно...
  useEffect(() => {
    if (phaseVoltageBranch == "2") {
      setVoltageThreePhase((state) => {
        const copy = { ...state };
        copy.two = false;
        copy.three = false;
        copy.four = false;
        copy.five = false;
        copy.six = false;
        return copy;
      });
    } else if (phaseVoltageBranch == "3") {
      setVoltageThreePhase((state) => {
        const copy = { ...state };
        copy.two = true;
        copy.three = false;
        copy.four = false;
        copy.five = false;
        copy.six = false;
        return copy;
      });
    } else if (phaseVoltageBranch == "4") {
      setVoltageThreePhase((state) => {
        const copy = { ...state };
        copy.two = true;
        copy.three = true;
        copy.four = false;
        copy.five = false;
        copy.six = false;
        return copy;
      });
    } else if (phaseVoltageBranch == "5") {
      setVoltageThreePhase((state) => {
        const copy = { ...state };
        copy.two = true;
        copy.three = true;
        copy.four = true;
        copy.five = false;
        copy.six = false;
        return copy;
      });
    } else if (phaseVoltageBranch == "6") {
      setVoltageThreePhase((state) => {
        const copy = { ...state };
        copy.two = true;
        copy.three = true;
        copy.four = true;
        copy.five = true;
        copy.six = false;
        return copy;
      });
    }
  }, [phaseVoltageBranch]);

  const reset = () => {
    setVisible(false);
    setBranchNumber("1");
    setPhaseVoltageBranch("1");
    setValue({
      one: {
        sectionCable: 2.5,
      },
      two: {
        sectionCable: 2.5,
      },
      three: {
        sectionCable: 2.5,
      },
      four: {
        sectionCable: 2.5,
      },
      five: {
        sectionCable: 2.5,
      },
      six: {
        sectionCable: 2.5,
      },
    });
  };

  // ############################### ТООЦООЛОХ ФУНКЦ ###################################
  const calcVoltage = (
    load: number,
    length: number,
    sectionCable: number,
    c: number
  ) => {
    const huwaari = sectionCable * c;
    const hurtver = load * length;

    const voltageDrop = hurtver / huwaari;
    return voltageDrop;
  };

  const publicCalc = (coeff: {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
    six: number;
  }) => {
    let voltageDrop1 = 0;
    let voltageDrop2 = 0;
    let voltageDrop3 = 0;
    let voltageDrop4 = 0;
    let voltageDrop5 = 0;
    let voltageDrop6 = 0;
    let equivalentVoltageDrop = 0;

    if (value.one.load && value.one.length) {
      voltageDrop1 = calcVoltage(
        parseFloat(value.one.load),
        parseFloat(value.one.length),
        value.one.sectionCable,
        coeff.one
      );
    } else voltageDrop1 = 0;

    if (value.two.load && value.two.length && coeff.two) {
      voltageDrop2 = calcVoltage(
        parseFloat(value.two.load),
        parseFloat(value.two.length),
        value.two.sectionCable,
        coeff.two
      );
    } else voltageDrop2 = 0;

    if (value.three.load && value.three.length && coeff.three) {
      voltageDrop3 = calcVoltage(
        parseFloat(value.three.load),
        parseFloat(value.three.length),
        value.three.sectionCable,
        coeff.three
      );
    } else voltageDrop3 = 0;

    if (value.four.load && value.four.length && coeff.four) {
      voltageDrop4 = calcVoltage(
        parseFloat(value.four.load),
        parseFloat(value.four.length),
        value.four.sectionCable,
        coeff.four
      );
    } else voltageDrop4 = 0;

    if (value.five.load && value.five.length && coeff.five) {
      voltageDrop5 = calcVoltage(
        parseFloat(value.five.load),
        parseFloat(value.five.length),
        value.five.sectionCable,
        coeff.five
      );
    } else voltageDrop5 = 0;

    if (value.six.load && value.six.length && coeff.six) {
      voltageDrop6 = calcVoltage(
        parseFloat(value.six.load),
        parseFloat(value.six.length),
        value.six.sectionCable,
        coeff.six
      );
    } else voltageDrop6 = 0;

    if (branchNumber == "1") equivalentVoltageDrop = voltageDrop1;

    if (branchNumber == "2") {
      if (phaseVoltageBranch == "1" || !phaseVoltageBranch)
        equivalentVoltageDrop = voltageDrop1 + voltageDrop2;
      else if (phaseVoltageBranch == "2")
        equivalentVoltageDrop = voltageDrop1 + voltageDrop2 * 1.31;
    }

    if (branchNumber == "3") {
      if (phaseVoltageBranch == "1" || !phaseVoltageBranch)
        equivalentVoltageDrop = voltageDrop1 + voltageDrop2 + voltageDrop3;
      else if (phaseVoltageBranch == "2")
        equivalentVoltageDrop =
          voltageDrop1 + 1.31 * (voltageDrop2 + voltageDrop3);
      else if (phaseVoltageBranch == "3")
        equivalentVoltageDrop =
          voltageDrop1 + voltageDrop2 + 1.31 * voltageDrop3;
    }

    if (branchNumber == "4") {
      if (phaseVoltageBranch == "1" || !phaseVoltageBranch)
        equivalentVoltageDrop =
          voltageDrop1 + voltageDrop2 + voltageDrop3 + voltageDrop4;
      else if (phaseVoltageBranch == "2")
        equivalentVoltageDrop =
          voltageDrop1 + 1.31 * (voltageDrop2 + voltageDrop3 + voltageDrop4);
      else if (phaseVoltageBranch == "3")
        equivalentVoltageDrop =
          voltageDrop1 + voltageDrop2 + 1.31 * (voltageDrop3 + voltageDrop4);
      else if (phaseVoltageBranch == "4")
        equivalentVoltageDrop =
          voltageDrop1 + voltageDrop2 + voltageDrop3 + 1.31 * voltageDrop4;
    }

    if (branchNumber == "5") {
      if (phaseVoltageBranch == "1" || !phaseVoltageBranch)
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          voltageDrop3 +
          voltageDrop4 +
          voltageDrop5;
      else if (phaseVoltageBranch == "2")
        equivalentVoltageDrop =
          voltageDrop1 +
          1.31 * (voltageDrop2 + voltageDrop3 + voltageDrop4 + voltageDrop5);
      else if (phaseVoltageBranch == "3")
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          1.31 * (voltageDrop3 + voltageDrop4 + voltageDrop5);
      else if (phaseVoltageBranch == "4")
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          voltageDrop3 +
          1.31 * (voltageDrop4 + voltageDrop5);
      else if (phaseVoltageBranch == "5")
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          voltageDrop3 +
          voltageDrop4 +
          voltageDrop5 * 1.31;
    }

    if (branchNumber == "6") {
      if (phaseVoltageBranch == "1" || !phaseVoltageBranch)
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          voltageDrop3 +
          voltageDrop4 +
          voltageDrop5 +
          voltageDrop6;
      else if (phaseVoltageBranch == "2")
        equivalentVoltageDrop =
          voltageDrop1 +
          1.31 *
            (voltageDrop2 +
              voltageDrop3 +
              voltageDrop4 +
              voltageDrop5 +
              voltageDrop6);
      else if (phaseVoltageBranch == "3")
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          1.31 * (voltageDrop3 + voltageDrop4 + voltageDrop5 + voltageDrop6);
      else if (phaseVoltageBranch == "4")
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          voltageDrop3 +
          1.31 * (voltageDrop4 + voltageDrop5 + voltageDrop6);
      else if (phaseVoltageBranch == "5")
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          voltageDrop3 +
          voltageDrop4 +
          1.31 * (voltageDrop5 + voltageDrop6);
      else if (phaseVoltageBranch == "6")
        equivalentVoltageDrop =
          voltageDrop1 +
          voltageDrop2 +
          voltageDrop3 +
          voltageDrop4 +
          voltageDrop5 +
          1.31 * voltageDrop6;
    }

    return equivalentVoltageDrop;
  };

  const calc = async () => {
    setVisible(true);

    const checkChangeCoeff = (coeff: number, num: keyof Value) => {
      changedCoeff[num] = coeff;
    };
    const changedCoeff = {
      one: 77,
      two: 77,
      three: 77,
      four: 77,
      five: 77,
      six: 77,
    };

    if (cableType == "CC1") {
      if (branchNumber == "1") {
        checkChangeCoeff(77, "one");
      } else if (branchNumber == "2") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(12.8, "two");
        }
      } else if (branchNumber == "3") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(12.8, "two");
          checkChangeCoeff(12.8, "three");
        } else if (phaseVoltageBranch == "3") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(12.8, "three");
        }
      } else if (branchNumber == "4") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(77, "four");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(12.8, "two");
          checkChangeCoeff(12.8, "three");
          checkChangeCoeff(12.8, "four");
        } else if (phaseVoltageBranch == "3") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(12.8, "three");
          checkChangeCoeff(12.8, "four");
        } else if (phaseVoltageBranch == "4") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(12.8, "four");
        }
      } else if (branchNumber == "5") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(77, "four");
          checkChangeCoeff(77, "five");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(12.8, "two");
          checkChangeCoeff(12.8, "three");
          checkChangeCoeff(12.8, "four");
          checkChangeCoeff(12.8, "five");
        } else if (phaseVoltageBranch == "3") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(12.8, "three");
          checkChangeCoeff(12.8, "four");
          checkChangeCoeff(12.8, "five");
        } else if (phaseVoltageBranch == "4") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(12.8, "four");
          checkChangeCoeff(12.8, "five");
        } else if (phaseVoltageBranch == "5") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(77, "four");
          checkChangeCoeff(12.8, "five");
        }
      } else if (branchNumber == "6") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(77, "four");
          checkChangeCoeff(77, "five");
          checkChangeCoeff(77, "six");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(12.8, "two");
          checkChangeCoeff(12.8, "three");
          checkChangeCoeff(12.8, "four");
          checkChangeCoeff(12.8, "five");
          checkChangeCoeff(12.8, "six");
        } else if (phaseVoltageBranch == "3") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(12.8, "three");
          checkChangeCoeff(12.8, "four");
          checkChangeCoeff(12.8, "five");
          checkChangeCoeff(12.8, "six");
        } else if (phaseVoltageBranch == "4") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(12.8, "four");
          checkChangeCoeff(12.8, "five");
          checkChangeCoeff(12.8, "six");
        } else if (phaseVoltageBranch == "5") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(77, "four");
          checkChangeCoeff(12.8, "five");
          checkChangeCoeff(12.8, "six");
        } else if (phaseVoltageBranch == "6") {
          checkChangeCoeff(77, "one");
          checkChangeCoeff(77, "two");
          checkChangeCoeff(77, "three");
          checkChangeCoeff(77, "four");
          checkChangeCoeff(77, "five");
          checkChangeCoeff(12.8, "six");
        }
      }
    } else if (cableType == "AC1") {
      if (branchNumber == "1") {
        checkChangeCoeff(46, "one");
      } else if (branchNumber == "2") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(7.7, "two");
        }
      } else if (branchNumber == "3") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(7.7, "two");
          checkChangeCoeff(7.7, "three");
        } else if (phaseVoltageBranch == "3") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(7.7, "three");
        }
      } else if (branchNumber == "4") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(46, "four");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(7.7, "two");
          checkChangeCoeff(7.7, "three");
          checkChangeCoeff(7.7, "four");
        } else if (phaseVoltageBranch == "3") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(7.7, "three");
          checkChangeCoeff(7.7, "four");
        } else if (phaseVoltageBranch == "4") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(7.7, "four");
        }
      } else if (branchNumber == "5") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(46, "four");
          checkChangeCoeff(46, "five");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(7.7, "two");
          checkChangeCoeff(7.7, "three");
          checkChangeCoeff(7.7, "four");
          checkChangeCoeff(7.7, "five");
        } else if (phaseVoltageBranch == "3") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(7.7, "three");
          checkChangeCoeff(7.7, "four");
          checkChangeCoeff(7.7, "five");
        } else if (phaseVoltageBranch == "4") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(7.7, "four");
          checkChangeCoeff(7.7, "five");
        } else if (phaseVoltageBranch == "5") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(46, "four");
          checkChangeCoeff(7.7, "five");
        }
      } else if (branchNumber == "6") {
        if (!phaseVoltageBranch) {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(46, "four");
          checkChangeCoeff(46, "five");
          checkChangeCoeff(46, "six");
        } else if (phaseVoltageBranch == "2") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(7.7, "two");
          checkChangeCoeff(7.7, "three");
          checkChangeCoeff(7.7, "four");
          checkChangeCoeff(7.7, "five");
          checkChangeCoeff(7.7, "six");
        } else if (phaseVoltageBranch == "3") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(7.7, "three");
          checkChangeCoeff(7.7, "four");
          checkChangeCoeff(7.7, "five");
          checkChangeCoeff(7.7, "six");
        } else if (phaseVoltageBranch == "4") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(7.7, "four");
          checkChangeCoeff(7.7, "five");
          checkChangeCoeff(7.7, "six");
        } else if (phaseVoltageBranch == "5") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(46, "four");
          checkChangeCoeff(7.7, "five");
          checkChangeCoeff(7.7, "six");
        } else if (phaseVoltageBranch == "6") {
          checkChangeCoeff(46, "one");
          checkChangeCoeff(46, "two");
          checkChangeCoeff(46, "three");
          checkChangeCoeff(46, "four");
          checkChangeCoeff(46, "five");
          checkChangeCoeff(7.7, "six");
        }
      }
    }
    const publicResult = publicCalc(changedCoeff);
    setResult(publicResult);

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
        <Text style={css.subtitle}>Үр дүн</Text>
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
            Сүүлийн хэрэглэгч дээрх нийлбэр хүчдэлийн алдагдал, (%):{"  "}
          </Text>
          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
            {result ? Math.round(result * 1000) / 1000 : null} %
          </Text>
        </Text>
      </Modal>
      <Text style={{ ...css.title, marginTop: 15 }}>Өгөгдөл</Text>
      {branchNumber == "1" && (
        <Image source={Image1} style={{ width: width, height: width / 2 }} />
      )}
      {branchNumber == "2" && (
        <Image source={Image2} style={{ width: width, height: width / 2 }} />
      )}
      {branchNumber == "3" && (
        <Image source={Image3} style={{ width: width, height: width / 1.5 }} />
      )}
      {branchNumber == "4" && (
        <Image source={Image4} style={{ width: width, height: width / 1.5 }} />
      )}
      {branchNumber == "5" && (
        <Image source={Image5} style={{ width: width, height: width / 1.5 }} />
      )}
      {branchNumber == "6" && (
        <Image source={Image6} style={{ width: width, height: width / 1.5 }} />
      )}
      <TwoPicker
        branches={branchNumberOption}
        voltageBranchNumbers={[...Array(parseInt(branchNumber))].map(
          (el, i) => ({
            label:
              i + 1 === 1
                ? "Бүх салаа 380В хүчдэлтэй"
                : i + 1 + "-c хойш бүх салаа 220В хүчдэлтэй",
            value: i + 1 + "",
          })
        )}
        value={[
          branchNumber ? branchNumber : "1",
          phaseVoltageBranch ? phaseVoltageBranch + "" : "1",
        ]}
        onChangeValue={setBranchNumber}
        checkChangeValue={setPhaseVoltageBranch}
      />
      {[...Array(parseInt(branchNumber))].map((e, i) => {
        let branch: "one" | "two" | "three" | "four" | "five" | "six" = "one";
        let previous: "one" | "two" | "three" | "four" | "five" | "six" | null =
          null;
        i = i + 1;
        if (i === 2) {
          branch = "two";
          previous = "one";
        } else if (i === 3) {
          branch = "three";
          previous = "two";
        } else if (i === 4) {
          branch = "four";
          previous = "three";
        } else if (i === 5) {
          branch = "five";
          previous = "four";
        } else if (i === 6) {
          branch = "six";
          previous = "five";
        } else {
          branch = "one";
          previous = null;
        }

        if (value[branch]) {
          return (
            <TextFieldThree
              label={`${i}-р салааны чадал, урт, хөндлөн огтлол`}
              placeholder={[`P${i}, кВт`, "Урт, м"]}
              key={i}
              keyboardType="numeric"
              check
              value={[
                value[branch].load ? value[branch].load + "" : "",
                value[branch].length ? value[branch].length + "" : "",
                value[branch].sectionCable ? value[branch].sectionCable : 2.5,
              ]}
              checkChangeText={(value) =>
                valueChanger(value, [branch, "length"], [1, 30])
              }
              onChangeText={(value) =>
                valueChanger(value, [branch, "load"], [1, 50])
              }
              checkChangeValue={(value) => {
                setValue((state) => {
                  const copy = { ...state };
                  if (!copy[branch])
                    copy[branch] = {
                      sectionCable: 2.5,
                    };
                  if (copy[branch]) {
                    copy[branch].sectionCable = parseFloat(value);
                  }
                  return copy;
                });
              }}
              error={{
                text: achaaAldsan
                  ? "Та 50кВт хүртэл утга оруулна уу"
                  : "Та 30м хүртэл утга оруулна уу",
                show: error[branch],
              }}
              cables={sectionCableOption.filter((cable) => {
                if (previous) {
                  if (value[previous].sectionCable === 2.5) {
                    return cable.value === 2.5;
                  } else {
                    return value[previous].sectionCable >= cable.value;
                  }
                } else {
                  return true;
                }
              })}
            />
          );
        } else {
          return <></>;
        }
      })}
      <FormPicker
        label="Кабелийн маяг"
        icon="google-circles-communities"
        options={cables}
        onValueChange={(value) => setCableType(value)}
        value={cableType}
      />
      <Button disable={disabled} onPress={calc}>
        Тооцоолох
      </Button>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default MagistralVoltageDropScreen;

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
