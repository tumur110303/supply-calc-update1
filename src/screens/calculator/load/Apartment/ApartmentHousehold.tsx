import { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Alert } from "react-native";

import CalcContext from "../../../../context/CalcContext";
import Button from "../../../../components/Button";
import Textfield from "../../../../components/Textfield";
import FormPicker from "../../../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../../../constants";
import Modal from "../../../../components/ResultModal";
import CountContext from "../../../../context/CountContext";
import OnOffSwitch from "../../../../components/switches/OnOffSwitch";

type Value = {
  earthSystem: boolean;
  people?: number;
  cable: "AC" | "CC" | "AW" | "CW";
};
type Error = {
  earthSystem?: boolean;
  people?: boolean;
  cable?: boolean;
};

const ApartmentHousehold: FC = () => {
  const { increase } = useContext(CountContext);
  const calcContext = useContext(CalcContext);

  const [value, setValue] = useState<Value>({ earthSystem: true, cable: "AC" });
  const cables = [
    { label: "Хөнгөнцагаан кабель", value: "AC" },
    { label: "Хөнгөнцагаан утас", value: "AW" },
    { label: "Зэс кабель", value: "CC" },
    { label: "Зэс утас", value: "CW" },
  ];
  const [error, setError] = useState<Error>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [result, setResult] = useState<any>();

  useEffect(() => {
    // Товч идэвхитэй, идэвхигүйг тодорхойлно.
    let disabled = true;
    disabled = !Object.values(error).every((el) => el !== true);
    if (!value.people) {
      disabled = true;
    } else disabled = false;

    // Disabled variable оноох...
    setDisabled(disabled);
  }, [value, error]);

  const reset = () => {
    setValue({ earthSystem: true, cable: "AC" });

    setResult(undefined);
    setVisible(false);
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

      setValue((value) => {
        const copy: any = { ...value };
        copy[key] = number;

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

  const calc = async () => {
    if (calcContext) {
      const quantityHouse = value.people ? value.people : 0;
      const housingLoad = calcContext.apartmentCalc(quantityHouse);
      const current = calcContext.currentThreePhase(housingLoad, 0.98);
      const circuitBreaker = calcContext.circuitBreaker(current);
      const conductor = calcContext.conductor(
        typeof circuitBreaker === "number" ? circuitBreaker : 2000,
        value.cable,
        value.earthSystem
      )[0];

      setResult([housingLoad, current, 0.98, circuitBreaker, conductor]);
    }

    setVisible(true);
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
        <Text style={css.subtitle}>Өгөгдөл : </Text>

        <View style={css.modalItem}>
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
              Сууцны тоо:
            </Text>
            <Text style={{ fontFamily: w400, flexWrap: "wrap" }}>
              {value.people}
            </Text>
          </Text>
        </View>

        <Text style={css.subtitle}>Үр дүн : </Text>
        {(() => {
          let labelCable = "Х/ц кабель";
          if (value.cable === "CC") labelCable = "Зэс кабель";
          else if (value.cable === "AW") labelCable = "Х/ц утас";
          else if (value.cable === "CW") labelCable = "Зэс утас";
          else labelCable = "Х/ц кабель";
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
              label: "Чадлын коэффициент",
              unit: null,
            },
            {
              label: "Автомат таслуурын гүйдэл",
              unit: "A",
            },
            {
              label: labelCable,
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
      <Text style={css.title}>Ерөнхий өгөгдөл</Text>

      <Textfield
        label="Сууцны тоог оруулна уу"
        placeholder="30-аас бага тоо оруулна уу"
        icon="home-group"
        keyboardType="numeric"
        value={value.people ? value.people + "" : ""}
        onChangeText={(value) => valueChanger(value, "people", [1, 30])}
        error={{
          text: "Та 1-30 хүртэлх бүхэл тоо оруулна уу",
          show: error.people,
        }}
      />

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
      <OnOffSwitch
        onValueChange={() => {
          setValue((state) => {
            const copy = { ...state };
            copy.earthSystem = !copy.earthSystem;
            return copy;
          });
        }}
        value={value.earthSystem}
        label={value.earthSystem ? "TN-S систем" : "TT систем"}
      />

      <Button disable={disabled} onPress={calc}>
        Тооцоолох
      </Button>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default ApartmentHousehold;

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
