import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Alert } from "react-native";

import CalcContext from "../../context/CalcContext";
import CountContext from "../../context/CountContext";

import Button from "../../components/Button";
import Textfield from "../../components/Textfield";
import FormPicker from "../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../constants";
import Modal from "../../components/ResultModal";
import Switch from "../../components/switches/Switch";
import * as Animatable from "react-native-animatable";

type Value = {
  firstPeople?: number;
  firstPlumb?: {
    quantity?: number;
    load?: string;
  };
  secondPeople?: number;
  secondPlumb?: {
    quantity?: number;
    load?: string;
  };
  thirdPeople?: number;
  thirdPlumb?: {
    quantity?: number;
    load?: string;
  };
  cable: "CC" | "CW";
};
type Error = {
  firstPeople?: boolean;
  firstPlumb?: boolean;
  secondPeople?: boolean;
  secondPlumb?: boolean;
  thirdPeople?: boolean;
  thirdPlumb?: boolean;
  cable?: boolean;
};

const ApartmentMeterMagistral: FC = () => {
  const calcContext = useContext(CalcContext);
  const { increase } = useContext(CountContext);

  const [value, setValue] = useState<Value>({
    cable: "CW",
  });
  const [error, setError] = useState<Error>({});
  const [numberPanel, setNumberPanel] = useState<"1" | "2" | "3">("1");

  const [have, setHave] = useState(false);
  const cables = [
    { label: "Зэс кабель", value: "CC" },
    { label: "Зэс утас", value: "CW" },
  ];
  const numbersOptions = [
    { label: "Нэг ДНС тэжээх шугам", value: "1" },
    { label: "Хоёр ДНС тэжээх шугам", value: "2" },
    { label: "Гурван ДНС тэжээх шугам", value: "3" },
  ];
  const [visible, setVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [result, setResult] = useState<any>();
  const [resultSecond, setResultSecond] = useState<any>();
  const [resultThird, setResultThird] = useState<any>();

  useEffect(() => {
    // Товч идэвхитэй, идэвхигүйг тодорхойлно.
    let disabled = true;
    disabled = !Object.values(error).every((el) => el !== true);
    if (!value.firstPeople) {
      disabled = true;
    } else if (
      (value.firstPlumb?.load && !value.firstPlumb.quantity) ||
      (!value.firstPlumb?.load && value.firstPlumb?.quantity)
    )
      disabled = true;
    else if (
      (value.secondPlumb?.load && !value.secondPlumb.quantity) ||
      (!value.secondPlumb?.load && value.secondPlumb?.quantity)
    )
      disabled = true;
    else if (
      (value.thirdPlumb?.load && !value.thirdPlumb.quantity) ||
      (!value.thirdPlumb?.load && value.thirdPlumb?.quantity)
    )
      disabled = true;
    else disabled = false;

    // Disabled variable оноох...
    setDisabled(disabled);
  }, [value, error]);

  useEffect(() => {
    setValue({
      cable: "CW",
    });
  }, [numberPanel]);

  useEffect(() => {
    if (!have) {
      setValue((state) => {
        const copy = { ...state };
        copy.firstPlumb = undefined;
        copy.secondPlumb = undefined;
        copy.thirdPlumb = undefined;

        return copy;
      });
    }
  }, [have]);

  const reset = () => {
    setValue({
      cable: "CW",
    });
    setHave(false);
    setNumberPanel("1");
    setResult(undefined);
    setResultSecond(undefined);
    setResultThird(undefined);
    setVisible(false);
    setError({});
  };

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

      if (
        key === "firstPlumb" ||
        key === "secondPlumb" ||
        key === "thirdPlumb"
      ) {
        setValue((value) => {
          const copy: any = { ...value };
          if (typeof id === "object") {
            if (!copy[key]) copy[key] = {};

            if (id[1] === "quantity") {
              copy[key].quantity = number;
            } else {
              copy[key].load = number;
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
        const copy: any = { ...value };
        copy[key] = undefined;

        return copy;
      });
    }
  };

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
          parseInt(number) < validation[0] ||
          validation[1] < parseInt(number)
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
        copy[key] = undefined;

        return copy;
      });
    }
  };

  const calculateParameter = (
    quantityHouse: number,
    quantityPlumb: number,
    plumbLoad: number
  ) => {
    if (calcContext) {
      // 02. Ачаалал бодох хэсэг...
      const housingLoad = calcContext.apartmentCalc(quantityHouse);
      const loadPlumb = calcContext.calcPlumb(quantityPlumb, plumbLoad);
      // 2.1. Тооцооны ачаалал...
      const power = housingLoad + 0.9 * loadPlumb;

      //   2.2. Чадлын коэффициент...
      const powerFactor = calcContext.equilentPowerFactor(
        [housingLoad, loadPlumb],
        [0.98, 0.8]
      );
      // 2.3. Тооцооны гүйдэл...
      const current = calcContext.currentThreePhase(
        power,
        powerFactor !== 0 ? powerFactor : 0.98
      );

      //   2.4. Бүрэн чадал...
      const capacity = power / powerFactor;

      return [power, current, capacity, powerFactor];
    } else return [0, 0, 0, 0];
  };

  const calc = async () => {
    //   01. Утга авах хэсэг
    if (calcContext) {
      if (numberPanel === "1") {
        const quantityHouse = value.firstPeople ? value.firstPeople : 0;
        const plumbLoad =
          value.firstPlumb && value.firstPlumb.load
            ? parseFloat(value.firstPlumb.load)
            : 0;
        const quantityPlumb =
          value.firstPlumb && value.firstPlumb.quantity
            ? value.firstPlumb.quantity
            : 0;

        // 2. Тооцоолох хэсэг...
        const result1 = calculateParameter(
          quantityHouse,
          quantityPlumb,
          plumbLoad
        );
        //   2.5. Автомат...
        const circuitBreaker = calcContext.circuitBreaker(result1[1]);

        //   2.6. Хөндлөн огтлол
        const sectionValue = calcContext.conductor(
          circuitBreaker,
          value.cable,
          true
        );

        const section = calcContext.stringifySection(
          sectionValue,
          value.cable,
          true
        );

        //   03. Үр дүнг нэгтгэх...
        setResult([
          ...result1,
          circuitBreaker !== 0
            ? circuitBreaker
            : "Хэт их ачаалалтай байгаа тул ачааллыг хувааж дамжуулна уу!",
          section,
        ]);
      } else if (numberPanel === "2") {
        //   1-р ДНС-ын өгөгдөл хувьсагчид оноов...
        const quantityHouse1 = value.firstPeople ? value.firstPeople : 0;
        const plumbLoad1 =
          value.firstPlumb && value.firstPlumb.load
            ? parseFloat(value.firstPlumb.load)
            : 0;
        const quantityPlumb1 =
          value.firstPlumb && value.firstPlumb.quantity
            ? value.firstPlumb.quantity
            : 0;

        //   2-р ДНС-ын өгөгдөл хувьсагчид оноов...
        const quantityHouse2 = value.secondPeople ? value.secondPeople : 0;
        const plumbLoad2 =
          value.secondPlumb && value.secondPlumb.load
            ? parseFloat(value.secondPlumb.load)
            : 0;
        const quantityPlumb2 =
          value.secondPlumb && value.secondPlumb.quantity
            ? value.secondPlumb.quantity
            : 0;

        // 2. Тооцоолох хэсэг...
        const result1 = calculateParameter(
          quantityHouse1 + quantityHouse2,
          quantityPlumb1 + quantityPlumb2,
          plumbLoad1 + plumbLoad2
        );
        const result2 = calculateParameter(
          quantityHouse2,
          quantityPlumb2,
          plumbLoad2
        );

        //   2.5. Автомат...
        const circuitBreaker = calcContext.circuitBreaker(result1[1]);
        const virtualCircuitBreaker = calcContext.circuitBreaker(result2[1]);

        //   2.6. Хөндлөн огтлол
        const sectionValue1 = calcContext.conductor(
          circuitBreaker,
          value.cable,
          true
        );

        const section1 = calcContext.stringifySection(
          sectionValue1,
          value.cable,
          true
        );

        const sectionValue2 = calcContext.conductor(
          virtualCircuitBreaker,
          value.cable,
          true
        );

        const section2 = calcContext.stringifySection(
          sectionValue2,
          value.cable,
          true
        );

        //   03. Үр дүнг нэгтгэх...
        setResult([
          ...result1,
          circuitBreaker !== 0
            ? circuitBreaker
            : "Хэт их ачаалалтай байгаа тул ачааллыг хувааж дамжуулна уу!",
          section1,
        ]);

        setResultSecond([...result2, section2]);
      } else {
        //   1-р ДНС-ын өгөгдөл хувьсагчид оноов...
        const quantityHouse1 = value.firstPeople ? value.firstPeople : 0;
        const plumbLoad1 =
          value.firstPlumb && value.firstPlumb.load
            ? parseFloat(value.firstPlumb.load)
            : 0;
        const quantityPlumb1 =
          value.firstPlumb && value.firstPlumb.quantity
            ? value.firstPlumb.quantity
            : 0;

        //   2-р ДНС-ын өгөгдөл хувьсагчид оноов...
        const quantityHouse2 = value.secondPeople ? value.secondPeople : 0;
        const plumbLoad2 =
          value.secondPlumb && value.secondPlumb.load
            ? parseFloat(value.secondPlumb.load)
            : 0;
        const quantityPlumb2 =
          value.secondPlumb && value.secondPlumb.quantity
            ? value.secondPlumb.quantity
            : 0;

        //   3-р ДНС-ын өгөгдөл хувьсагчид оноов...
        const quantityHouse3 = value.thirdPeople ? value.thirdPeople : 0;
        const plumbLoad3 =
          value.thirdPlumb && value.thirdPlumb.load
            ? parseFloat(value.thirdPlumb.load)
            : 0;
        const quantityPlumb3 =
          value.thirdPlumb && value.thirdPlumb.quantity
            ? value.thirdPlumb.quantity
            : 0;

        // 2. Тооцоолох хэсэг...
        const result1 = calculateParameter(
          quantityHouse1 + quantityHouse2 + quantityHouse3,
          quantityPlumb1 + quantityPlumb2 + quantityPlumb3,
          plumbLoad1 + plumbLoad2 + plumbLoad3
        );
        const result2 = calculateParameter(
          quantityHouse2 + quantityHouse3,
          quantityPlumb2 + quantityPlumb3,
          plumbLoad2 + plumbLoad3
        );
        const result3 = calculateParameter(
          quantityHouse3,
          quantityPlumb3,
          plumbLoad3
        );

        //   2.5. Автомат...
        const circuitBreaker = calcContext.circuitBreaker(result1[1]);
        const virtualCircuitBreaker = calcContext.circuitBreaker(result3[1]);
        const currentSecond =
          result2[1] > virtualCircuitBreaker
            ? result2[1]
            : virtualCircuitBreaker;

        //   2.6. Хөндлөн огтлол
        const sectionValue1 = calcContext.conductor(
          circuitBreaker,
          value.cable,
          true
        );

        const section1 = calcContext.stringifySection(
          sectionValue1,
          value.cable,
          true
        );

        const sectionValue2 = calcContext.conductor(
          currentSecond,
          value.cable,
          true
        );

        const section2 = calcContext.stringifySection(
          sectionValue2,
          value.cable,
          true
        );

        const sectionValue3 = calcContext.conductor(
          virtualCircuitBreaker,
          value.cable,
          true
        );

        const section3 = calcContext.stringifySection(
          sectionValue3,
          value.cable,
          true
        );

        //   03. Үр дүнг нэгтгэх...
        setResult([
          ...result1,
          circuitBreaker !== 0
            ? circuitBreaker
            : "Хэт их ачаалалтай байгаа тул ачааллыг хувааж дамжуулна уу!",
          section1,
        ]);

        setResultSecond([...result2, section2]);
        setResultThird([...result3, section3]);
      }
    }

    setVisible(true);
    await increase();
  };

  return (
    <ScrollView style={css.container}>
      {numberPanel === "1" && (
        <Modal
          visible={visible}
          setVisible={setVisible}
          title="Тооцооны хариу"
          reset={reset}
        >
          <Text style={css.subtitle}>Өгөгдөл : </Text>
          {(() => {
            const data = [
              {
                label: "Сууцны тоо",
                value: value.firstPeople,
                unit: null,
              },
              {
                label: "Сантехникийн т/т-ийн нийт чадал",
                value: value.firstPlumb?.load,
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
          <Text style={css.subtitle}>Үр дүн : </Text>
          {(() => {
            const labelCable = value.cable === "CC" ? "Зэс кабель" : "Зэс утас";
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
                label: "Бүрэн чадал",
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
                label: labelCable,
                unit: "мм.кв",
              },
            ];
            return (
              <>
                {data.map(({ label, unit }, i) => {
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
                        {result && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {result[i] && typeof result[i] === "number"
                              ? Math.round(result[i] * 1000) / 1000
                              : result[i]}{" "}
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
        </Modal>
      )}

      {numberPanel === "2" && (
        <Modal
          visible={visible}
          setVisible={setVisible}
          title="Тооцооны хариу"
          reset={reset}
        >
          <Text style={css.subtitle}>Өгөгдөл : </Text>
          {(() => {
            const data = [
              {
                label: "ДНС-1-н сууцны тоо",
                value: value.firstPeople,
                unit: null,
              },
              {
                label: "ДНС-2-н сууцны тоо",
                value: value.secondPeople,
                unit: null,
              },
              {
                label: "ДНС-1-н сантехникийн т/т-ийн нийт чадал",
                value: value.firstPlumb?.load,
                unit: "кВт",
              },
              {
                label: "ДНС-2-н сантехникийн т/т-ийн нийт чадал",
                value: value.secondPlumb?.load,
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
          <Text style={css.subtitle}>
            Магистрал шугамын эхэн дэх үр дүн (XC -с ДНС-1 рүү):{" "}
          </Text>
          {(() => {
            const labelCable = value.cable === "CC" ? "Зэс кабель" : "Зэс утас";
            const data = [
              {
                label: "Шугамын тооцооны чадал",
                unit: "кВт",
              },
              {
                label: "Шугамын тооцооны гүйдэл",
                unit: "А",
              },
              {
                label: "Шугамын бүрэн чадал",
                unit: "кВА",
              },
              {
                label: "Дундаж чадлын коэффициент",
                unit: null,
              },
              {
                label: "Магистрал шугамын эхэн дэх автомат",
                unit: "A",
              },
              {
                label: labelCable,
                unit: "мм.кв",
              },
            ];
            return (
              <>
                {data.map(({ label, unit }, i) => {
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
                        {result && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {result[i] && typeof result[i] === "number"
                              ? Math.round(result[i] * 1000) / 1000
                              : result[i]}{" "}
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
          <Text style={css.subtitle}>
            Магистрал шугамын төгсгөл хэсгийн үр дүн (ДНС-1-с ДНС-2 руу):{" "}
          </Text>
          {(() => {
            const labelCable = value.cable === "CC" ? "Зэс кабель" : "Зэс утас";
            const data = [
              {
                label: "Шугамын тооцооны чадал",
                unit: "кВт",
              },
              {
                label: "Шугамын тооцооны гүйдэл",
                unit: "А",
              },
              {
                label: "Шугамын бүрэн чадал",
                unit: "кВА",
              },
              {
                label: "Дундаж чадлын коэффициент",
                unit: null,
              },
              {
                label: labelCable,
                unit: "мм.кв",
              },
            ];
            return (
              <>
                {data.map(({ label, unit }, i) => {
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
                        {resultSecond && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {resultSecond[i] &&
                            typeof resultSecond[i] === "number"
                              ? Math.round(resultSecond[i] * 1000) / 1000
                              : resultSecond[i]}{" "}
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
        </Modal>
      )}

      {numberPanel === "3" && (
        <Modal
          visible={visible}
          setVisible={setVisible}
          title="Тооцооны хариу"
          reset={reset}
        >
          <Text style={css.subtitle}>Өгөгдөл : </Text>
          {(() => {
            const data = [
              {
                label: "ДНС-1-н сууцны тоо",
                value: value.firstPeople,
                unit: null,
              },
              {
                label: "ДНС-2-н сууцны тоо",
                value: value.secondPeople,
                unit: null,
              },
              {
                label: "ДНС-3-н сууцны тоо",
                value: value.thirdPeople,
                unit: null,
              },
              {
                label: "ДНС-1-н сантехникийн т/т-ийн нийт чадал",
                value: value.firstPlumb?.load,
                unit: "кВт",
              },
              {
                label: "ДНС-2-н сантехникийн т/т-ийн нийт чадал",
                value: value.secondPlumb?.load,
                unit: "кВт",
              },
              {
                label: "ДНС-3-н сантехникийн т/т-ийн нийт чадал",
                value: value.thirdPlumb?.load,
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
          <Text style={css.subtitle}>
            Магистрал шугамын эхэн дэх үр дүн (XC -с ДНС-1 рүү):{" "}
          </Text>
          {(() => {
            const labelCable = value.cable === "CC" ? "Зэс кабель" : "Зэс утас";
            const data = [
              {
                label: "Шугамын тооцооны чадал",
                unit: "кВт",
              },
              {
                label: "Шугамын тооцооны гүйдэл",
                unit: "А",
              },
              {
                label: "Шугамын бүрэн чадал",
                unit: "кВА",
              },
              {
                label: "Дундаж чадлын коэффициент",
                unit: null,
              },
              {
                label: "Магистрал шугамын эхэн дэх автомат",
                unit: "A",
              },
              {
                label: labelCable,
                unit: "мм.кв",
              },
            ];
            return (
              <>
                {data.map(({ label, unit }, i) => {
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
                        {result && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {result[i] && typeof result[i] === "number"
                              ? Math.round(result[i] * 1000) / 1000
                              : result[i]}{" "}
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
          <Text style={css.subtitle}>
            Магистрал шугамын дунд хэсгийн үр дүн (ДНС-1-с ДНС-2 руу):{" "}
          </Text>
          {(() => {
            const labelCable = value.cable === "CC" ? "Зэс кабель" : "Зэс утас";
            const data = [
              {
                label: "Шугамын тооцооны чадал",
                unit: "кВт",
              },
              {
                label: "Шугамын тооцооны гүйдэл",
                unit: "А",
              },
              {
                label: "Шугамын бүрэн чадал",
                unit: "кВА",
              },
              {
                label: "Дундаж чадлын коэффициент",
                unit: null,
              },
              {
                label: labelCable,
                unit: "мм.кв",
              },
            ];
            return (
              <>
                {data.map(({ label, unit }, i) => {
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
                        {resultSecond && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {resultSecond[i] &&
                            typeof resultSecond[i] === "number"
                              ? Math.round(resultSecond[i] * 1000) / 1000
                              : resultSecond[i]}{" "}
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
          <Text style={css.subtitle}>
            Магистрал шугамын төгсгөл хэсгийн үр дүн (ДНС-2-с ДНС-3 руу):{" "}
          </Text>
          {(() => {
            const labelCable = value.cable === "CC" ? "Зэс кабель" : "Зэс утас";
            const data = [
              {
                label: "Шугамын тооцооны чадал",
                unit: "кВт",
              },
              {
                label: "Шугамын тооцооны гүйдэл",
                unit: "А",
              },
              {
                label: "Шугамын бүрэн чадал",
                unit: "кВА",
              },
              {
                label: "Дундаж чадлын коэффициент",
                unit: null,
              },
              {
                label: labelCable,
                unit: "мм.кв",
              },
            ];
            return (
              <>
                {data.map(({ label, unit }, i) => {
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
                        {resultThird && (
                          <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
                            {resultThird[i] &&
                            typeof resultThird[i] === "number"
                              ? Math.round(resultThird[i] * 1000) / 1000
                              : resultThird[i]}{" "}
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
        </Modal>
      )}

      <Text style={css.title}>Ерөнхий өгөгдөл</Text>
      <FormPicker
        label="Давхрын нэгдсэн самбарын тоо"
        icon="dots-horizontal"
        options={numbersOptions}
        onValueChange={(value: any) => {
          setNumberPanel(value);
        }}
        value={numberPanel}
      />
      <Textfield
        label="ДНС-1-с тэжээгдэх сууцны тоо"
        placeholder="6-аас бага тоо оруулна уу"
        icon="home-city"
        keyboardType="numeric"
        value={value.firstPeople ? value.firstPeople + "" : ""}
        onChangeText={(value) => valueChanger(value, "firstPeople", [1, 6])}
        error={{
          text: "Та 1-6 хүртэлх бүхэл тоо оруулна уу",
          show: error.firstPeople,
        }}
      />
      {numberPanel === "2" && (
        <Textfield
          label="ДНС-2-с тэжээгдэх сууцны тоо"
          placeholder="6-аас бага тоо оруулна уу"
          icon="home-city"
          keyboardType="numeric"
          value={value.secondPeople ? value.secondPeople + "" : ""}
          onChangeText={(value) => valueChanger(value, "secondPeople", [1, 6])}
          error={{
            text: "Та 1-6 хүртэлх бүхэл тоо оруулна уу",
            show: error.secondPeople,
          }}
        />
      )}

      {numberPanel === "3" && (
        <Textfield
          label="ДНС-2-с тэжээгдэх сууцны тоо"
          placeholder="6-аас бага тоо оруулна уу"
          icon="home-city"
          keyboardType="numeric"
          value={value.secondPeople ? value.secondPeople + "" : ""}
          onChangeText={(value) => valueChanger(value, "secondPeople", [1, 6])}
          error={{
            text: "Та 1-6 хүртэлх бүхэл тоо оруулна уу",
            show: error.secondPeople,
          }}
        />
      )}
      {numberPanel === "3" && (
        <Textfield
          label="ДНС-3-с тэжээгдэх сууцны тоо"
          placeholder="6-аас бага тоо оруулна уу"
          icon="home-city"
          keyboardType="numeric"
          value={value.thirdPeople ? value.thirdPeople + "" : ""}
          onChangeText={(value) => valueChanger(value, "thirdPeople", [1, 6])}
          error={{
            text: "Та 1-6 хүртэлх бүхэл тоо оруулна уу",
            show: error.thirdPeople,
          }}
        />
      )}
      <FormPicker
        label="Утас, кабель"
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
      />

      {/* Хүчний төхөөрөмжүүд... */}
      <Animatable.View
        animation={have ? "fadeInDown" : "fadeInUp"}
        duration={have ? 500 : 3000}
      >
        {have ? (
          <Text style={{ ...css.title, marginTop: 15 }}>
            Хүчний төхөөрөмжийн өгөгдөл
          </Text>
        ) : null}
        {have ? (
          <Textfield
            label="ДНС-1-н сантехникийн тоног төхөөрөмжүүд"
            placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
            icon={["water-pump", "lightning-bolt"]}
            keyboardType="numeric"
            check
            value={[
              value.firstPlumb
                ? value.firstPlumb.quantity
                  ? value.firstPlumb.quantity + ""
                  : ""
                : "",
              value.firstPlumb
                ? value.firstPlumb.load
                  ? value.firstPlumb.load + ""
                  : ""
                : "",
            ]}
            onChangeText={(value) =>
              valueChanger(value, ["firstPlumb", "quantity"])
            }
            checkChangeText={(value) =>
              valueChangerButarhai(value, ["firstPlumb", "load"], [0, 20])
            }
            error={{
              text: "Та 0-20кВт хүртэл чадлын утга оруулна уу",
              show: error.firstPlumb,
            }}
          />
        ) : null}

        {(have && numberPanel === "2") || (have && numberPanel === "3") ? (
          <Textfield
            label="ДНС-2-н сантехникийн тоног төхөөрөмжүүд"
            placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
            icon={["water-pump", "lightning-bolt"]}
            keyboardType="numeric"
            check
            value={[
              value.secondPlumb
                ? value.secondPlumb.quantity
                  ? value.secondPlumb.quantity + ""
                  : ""
                : "",
              value.secondPlumb
                ? value.secondPlumb.load
                  ? value.secondPlumb.load + ""
                  : ""
                : "",
            ]}
            onChangeText={(value) =>
              valueChanger(value, ["secondPlumb", "quantity"])
            }
            checkChangeText={(value) =>
              valueChangerButarhai(value, ["secondPlumb", "load"], [0, 20])
            }
            error={{
              text: "Та 0-20кВт хүртэл чадлын утга оруулна уу",
              show: error.secondPlumb,
            }}
          />
        ) : null}

        {have && numberPanel === "3" ? (
          <Textfield
            label="ДНС-3-н сантехникийн тоног төхөөрөмжүүд"
            placeholder={["Нийт тоо, ш", "Нийт чадал, кВт"]}
            icon={["water-pump", "lightning-bolt"]}
            keyboardType="numeric"
            check
            value={[
              value.thirdPlumb
                ? value.thirdPlumb.quantity
                  ? value.thirdPlumb.quantity + ""
                  : ""
                : "",
              value.thirdPlumb
                ? value.thirdPlumb.load
                  ? value.thirdPlumb.load + ""
                  : ""
                : "",
            ]}
            onChangeText={(value) =>
              valueChanger(value, ["thirdPlumb", "quantity"])
            }
            checkChangeText={(value) =>
              valueChangerButarhai(value, ["thirdPlumb", "load"], [0, 20])
            }
            error={{
              text: "Та 0-20кВт хүртэл чадлын утга оруулна уу",
              show: error.thirdPlumb,
            }}
          />
        ) : null}
      </Animatable.View>
      <Animatable.View
        animation={have ? "pulse" : "fadeInUp"}
        duration={have ? 3000 : 500}
      >
        <Switch
          onPress={() => setHave(!have)}
          value={have}
          label="Хүчний төхөөрөмжүүд"
          innerText={["Off", "On"]}
        />
      </Animatable.View>
      <Button onPress={calc}>Тооцоолох</Button>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default ApartmentMeterMagistral;

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
