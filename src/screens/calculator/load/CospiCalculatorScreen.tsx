import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Dimensions } from "react-native";

import Button from "../../../components/Button";
import FormPicker from "../../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../../constants";
import Modal from "../../../components/ResultModal";
import CountContext from "../../../context/CountContext";
import Textfield from "../../../components/Textfield";
import CalcContext from "../../../context/CalcContext";

const { width } = Dimensions.get("window");

// #########################################  TYPE ########################################
type Value = {
  one?: {
    load?: string;
    pf?: string;
  };
  two?: {
    load?: string;
    pf?: string;
  };
  three?: {
    load?: string;
    pf?: string;
  };
  four?: {
    load?: string;
    pf?: string;
  };
  five?: {
    load?: string;
    pf?: string;
  };
  six?: {
    load?: string;
    pf?: string;
  };
  seven?: {
    load?: string;
    pf?: string;
  };
  eight?: {
    load?: string;
    pf?: string;
  };
  nine?: {
    load?: string;
    pf?: string;
  };
  ten?: {
    load?: string;
    pf?: string;
  };
};

type Error = {
  one?: boolean;
  two?: boolean;
  three?: boolean;
  four?: boolean;
  five?: boolean;
  six?: boolean;
  seven?: boolean;
  eight?: boolean;
  nine?: boolean;
  ten?: boolean;
};

const CospiCalculatorScreen: FC = () => {
  const { increase } = useContext(CountContext);
  const calcContext = useContext(CalcContext);

  // ################################# VARIABLES ########################################
  const [value, setValue] = useState<Value>({});

  // Cable-ийн төрөл case : зэс эсвэл хөнгөнцагаан...
  const [userNumber, setUserNumber] = useState<string>("1");
  const userNumberOption = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
  ];

  // Салааны фазын хүчдэлтэй хэсэг...

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
    id: keyof Value | [keyof Value, "load" | "pf"],
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

      setValue((value) => {
        const copy: any = { ...value };
        if (typeof id === "object") {
          if (!copy[key]) copy[key] = {};

          if (id[1] === "load") copy[key].load = number;
          else if (id[1] === "pf") copy[key].pf = number;
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

  // Button идэвхгүй болгох эсэхийг шийдэх функц...
  useEffect(() => {
    let disabled = true;
    disabled = !Object.values(error).every((el) => el !== true);

    if (
      (value.one?.load && !value.one.pf) ||
      (!value.one?.load && value.one?.pf)
    )
      disabled = true;
    else if (
      (value.two?.load && !value.two.pf) ||
      (!value.two?.load && value.two?.pf)
    )
      disabled = true;
    else if (
      (value.three?.load && !value.three.pf) ||
      (!value.three?.load && value.three?.pf)
    )
      disabled = true;
    else if (
      (value.four?.load && !value.four.pf) ||
      (!value.four?.load && value.four?.pf)
    )
      disabled = true;
    else if (
      (value.five?.load && !value.five.pf) ||
      (!value.five?.load && value.five?.pf)
    )
      disabled = true;
    else if (
      (value.six?.load && !value.six.pf) ||
      (!value.six?.load && value.six?.pf)
    )
      disabled = true;
    else if (
      (value.seven?.load && !value.seven.pf) ||
      (!value.seven?.load && value.seven?.pf)
    )
      disabled = true;
    else if (
      (value.eight?.load && !value.eight.pf) ||
      (!value.eight?.load && value.eight?.pf)
    )
      disabled = true;
    else if (
      (value.nine?.load && !value.nine.pf) ||
      (!value.nine?.load && value.nine?.pf)
    )
      disabled = true;
    else if (
      (value.ten?.load && !value.ten.pf) ||
      (!value.ten?.load && value.ten?.pf)
    )
      disabled = true;
    else disabled = false;

    // Disabled variable оноох...
    setDisabled(disabled);
  }, [value, error]);

  // ################################ PARAMETER БЭЛТГЭХ ###############################

  const reset = () => {
    setUserNumber("1");
    setVisible(false);
    setValue({});
    setError({});
    setResult(null);
  };

  // ############################### ТООЦООЛОХ ФУНКЦ ###################################
  const calc = async () => {
    setVisible(true);

    if (calcContext) {
      const firstLoad = value.one?.load ? parseFloat(value.one.load) : 0;
      const secondLoad = value.two?.load ? parseFloat(value.two.load) : 0;
      const thirdLoad = value.three?.load ? parseFloat(value.three.load) : 0;
      const fourthLoad = value.four?.load ? parseFloat(value.four.load) : 0;
      const fifthLoad = value.five?.load ? parseFloat(value.five.load) : 0;
      const sixthLoad = value.six?.load ? parseFloat(value.six.load) : 0;
      const seventLoad = value.seven?.load ? parseFloat(value.seven.load) : 0;
      const eighthLoad = value.eight?.load ? parseFloat(value.eight.load) : 0;
      const ninethLoad = value.nine?.load ? parseFloat(value.nine.load) : 0;
      const tenthLoad = value.ten?.load ? parseFloat(value.ten.load) : 0;

      const firstPf = value.one?.pf ? parseFloat(value.one.pf) : 1;
      const secondPf = value.two?.pf ? parseFloat(value.two.pf) : 1;
      const thirdPf = value.three?.pf ? parseFloat(value.three.pf) : 1;
      const fourthPf = value.four?.pf ? parseFloat(value.four.pf) : 1;
      const fifthPf = value.five?.pf ? parseFloat(value.five.pf) : 1;
      const sixthPf = value.six?.pf ? parseFloat(value.six.pf) : 1;
      const seventPf = value.seven?.pf ? parseFloat(value.seven.pf) : 1;
      const eighthPf = value.eight?.pf ? parseFloat(value.eight.pf) : 1;
      const ninethPf = value.nine?.pf ? parseFloat(value.nine.pf) : 1;
      const tenthPf = value.ten?.pf ? parseFloat(value.ten.pf) : 1;

      const loads = [
        firstLoad,
        secondLoad,
        thirdLoad,
        fourthLoad,
        fifthLoad,
        sixthLoad,
        seventLoad,
        eighthLoad,
        ninethLoad,
        tenthLoad,
      ];
      const pf = [
        firstPf,
        secondPf,
        thirdPf,
        fourthPf,
        fifthPf,
        sixthPf,
        seventPf,
        eighthPf,
        ninethPf,
        tenthPf,
      ];

      const powerFactor = calcContext.equilentPowerFactor(loads, pf);
      setResult(powerFactor);
    }

    // Төлбөр хийгдээгүй үед ашиглахаас сэргийлэх функц...
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
        {(() => {
          const data = [
            {
              label: "Дундаж чадлын коэффициент",
              unit: null,
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
                          {result && Math.round(result * 1000) / 1000} {unit}
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

      <Text style={{ ...css.title, marginTop: 15 }}>Өгөгдөл</Text>
      <FormPicker
        label="Ялгаатай Cosф-тэй хэрэглэгчидийн тоо"
        icon="account-settings"
        options={userNumberOption}
        onValueChange={(value) => setUserNumber(value)}
        value={userNumber}
      />

      {[...Array(parseInt(userNumber))].map((e, i) => {
        let branch:
          | "one"
          | "two"
          | "three"
          | "four"
          | "five"
          | "six"
          | "seven"
          | "eight"
          | "nine"
          | "ten" = "one";
        let previous:
          | "one"
          | "two"
          | "three"
          | "four"
          | "five"
          | "six"
          | "seven"
          | "eight"
          | "nine"
          | "ten"
          | null = null;
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
        } else if (i === 7) {
          branch = "seven";
          previous = "six";
        } else if (i === 8) {
          branch = "eight";
          previous = "seven";
        } else if (i === 9) {
          branch = "nine";
          previous = "eight";
        } else if (i === 10) {
          branch = "ten";
          previous = "nine";
        } else {
          branch = "one";
          previous = null;
        }

        return (
          <Textfield
            label={`${i}-р хэрэглэгчийн чадал, Cosф`}
            placeholder={["Нийт чадал, кВт", "Cosф"]}
            icon={["lightning-bolt", "lightning-bolt"]}
            keyboardType="numeric"
            check
            value={[
              value[branch]
                ? value[branch]?.load
                  ? value[branch]?.load + ""
                  : ""
                : "",
              value[branch]
                ? value[branch]?.pf
                  ? value[branch]?.pf + ""
                  : ""
                : "",
            ]}
            onChangeText={(value: any) =>
              valueChanger(value, [branch, "load"], [1, 2000])
            }
            checkChangeText={(value: any) =>
              valueChanger(value, [branch, "pf"], [0, 1])
            }
            error={{
              text: achaaAldsan
                ? "Та 1-2000кВт хүртэл утга оруулна уу"
                : "Та 0-1 хүртэл утга оруулна уу",
              show: error[branch],
            }}
          />
        );
      })}

      <Button
        disable={disabled || !value.one?.load || !value.one.pf}
        onPress={calc}
      >
        Тооцоолох
      </Button>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default CospiCalculatorScreen;

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
