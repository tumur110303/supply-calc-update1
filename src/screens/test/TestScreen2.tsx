import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import React, { FC, useEffect, useState, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dark, main, w500 } from "../../constants";
import Button from "../../components/Button";

const { width } = Dimensions.get("screen");

const TestScreen2: FC = () => {
  const [hariulsan, setHariulsan] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [shalgasan, setShalgasan] = useState<boolean>(false);
  const [zowHariulsan, setZowHariulsan] = useState<boolean[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const utgaUurchluh = (a: number, i: number) => {
    setHariulsan((state) => {
      const copyState = [...state];
      if (copyState[a] === i) {
        copyState[a] = -1;
      } else {
        copyState[a] = i;
      }

      return copyState;
    });
  };

  useEffect(() => {
    tests.map((el, i) => {
      setZowHariulsan((state) => {
        const copy = [...state];

        copy[i] = hariulsan[i] + 1 === tests[i].hariu;
        return copy;
      });
    });
  }, [hariulsan]);

  useEffect(() => {
    const scores: number[] = [];

    zowHariulsan.map((el, i) =>
      el === false ? (scores[i] = 0) : (scores[i] = 1)
    );

    setTotalScore(() => {
      const total = scores.reduce((a, b) => a + b, 0);
      return total;
    });
  }, [hariulsan, zowHariulsan]);

  const clicked = async () => {
    setShalgasan(!shalgasan);
    let dvn = "";
    if (totalScore < 6) dvn = "F";
    else if (totalScore < 7) dvn = "D";
    else if (totalScore < 8) dvn = "C";
    else if (totalScore < 9) dvn = "B";
    else dvn = "A";

    if (shalgasan) {
      setHariulsan(() => []);
    } else {
      Alert.alert(
        `Таны дүн : ${dvn}`,
        `Та 10-н асуултаас ${totalScore} асуултанд зөв хариулсан байна.`,
        [
          {
            text: "Ойлгосон",
            onPress: () => {},
            style: "cancel",
          },
        ]
      );
    }
  };

  const tests = [
    {
      question:
        "Барилга байгууламжийн тооцооны чадлыг тодорхойлох ач холбогдол нь:",
      songoltuud: [
        "Тооцооны гүйдлийг тодорхойлоход хэрэгтэй.",
        "Тэжээлийн кабелийн хөндлөн огтлол, хамгаалах хэрэгслийн тавил сонгоход хэрэгтэй.",
        "Дээрх хоёр хариулт хоёулаа зөв",
      ],
      hariu: 3,
    },
    {
      question: "Cosф буурсанаар дараах сөрөг үр дагавартай.",
      songoltuud: [
        "Гүйдэл ихэсч, тоног төхөөрөмжийн овор хэмжээ өсч, хүчдэлийн алдагдал ихсэнэ.",
        "Ашигт үйлийн коэффициент багасна.",
        "Идэвхитэй чадлын алдагдал ихсэнэ.",
      ],
      hariu: 1,
    },
    {
      question: "Хэлхээний бодит чадлын алдагдал нь:",
      songoltuud: [
        "Дулааны энерги болон хувирч, халалтанд зарцуулагдана.",
        "Хүчдэлээс болж алдагдана.",
        "Ямар нэг энергид хувирахгүйгээр шууд алдагдана.",
      ],
      hariu: 1,
    },
    {
      question:
        "Барилга байгууламжийн тооцооны бүрэн чадлыг тодорхойлох шаардлага нь:",
      songoltuud: [
        "Хэлхээгээр гүйх гүйдлийг тодорхойлоход хэрэгтэй.",
        "Үүсгүүрийн хүчин чадлыг тодорхойлоход хэрэгтэй.",
        "Сүлжээний бусад бүх параметрүүдийг тодорхойлоход шаардлагатай.",
      ],
      hariu: 2,
    },
    {
      question: "Эмнэлэгийн барилга ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: [
        "Эмнэлэг доторх бүх тоног төхөөрөмж I зэргийн",
        "Мэс засал, эрчимт эмчилгээ, төрөх, сувилагчийн пост, галын эсэргүүцэх хэрэгслээс бусад нь II зэргийн",
        "Мэс засал, эрчимт эмчилгээ, төрөх, сувилагчийн пост, галын эсэргүүцэх хэрэгслээс бусад нь III зэргийн",
      ],
      hariu: 2,
    },
    {
      question:
        "Барилгын тооцоонд розетканы суурилагдсан чадлыг хэдэн Вт-р авч тооцох вэ?",
      songoltuud: [
        "300Вт",
        "Залгах тоног төхөөрөмжүүдийн тус бүрийн чадлаар",
        "60-100Вт",
      ],
      hariu: 3,
    },
    {
      question:
        "Иргэний барилгад ямар гэрлийн үүсгүүртэй гэрэлтүүлэгч хэрэглэх нь тохиромжтой вэ?",
      songoltuud: [
        "Люминесцент, улайсах чийдэнтэй гэрэлтүүлэгч хэрэглэх нь тохиромжтой",
        "Аль болох улайсах чийдэнтэй гэрэлтүүлэгч хэрэглэхээс татгалзах хэрэгтэй.",
        "Бүх гэрэлтүүлэгчийг LED чийдэнтэй гэрэлтүүлэгчээр төлөвлөх хэрэгтэй.",
      ],
      hariu: 2,
    },
    {
      question:
        "Манай орны цахилгаан системд хэрэглэгдэж байгаа хувьсах гүйдэл нь тогтмол гүйдлээс юугаараа ялгаатай вэ?",
      songoltuud: [
        "Хугацаанаас хамааран хэмжээ болон чиглэл нь өөрчлөгдөж байдаг.",
        "Хугацаанаас хамааран хэмжээ нь өөрчлөгдөж байдаг.",
        "Хугацаанаас хамааран хэмжээ, чиглэл, давтамж нь өөрчлөгдөж байдаг.",
      ],
      hariu: 1,
    },
    {
      question: "Хүчдэлийн хэлбийлт гэж юу вэ?",
      songoltuud: [
        "Хүчдэлийн хамгийн их утга ба хамгийн бага утгын зөрүүг хэвийн хүчдэлд харьцуулсан харьцаа",
        "Хэвийн хүчдэлийн утга, үйлчлэх хүчдэлийн утгын зөрүүг хэвийн хүчдэлд харьцуулсан харьцаа",
        "Хүчдэлийн зөвшөөрөгдөх алдагдал",
      ],
      hariu: 2,
    },
    {
      question:
        "Иргэний барилгын тооцооны чадлыг тодорхойлоход ямар итгэлцүүрийг ашиглах вэ?",
      songoltuud: [
        "Шаардлагын коэффициент",
        "Чадлын коэффициент",
        "Ашиглалтын коэффициент",
      ],
      hariu: 1,
    },
  ];

  useEffect(() => {
    const hariulaagu = hariulsan.findIndex((index) => index === -1);
    if (hariulaagu === -1) {
      if (hariulsan.length === 10) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  }, [hariulsan]);

  return (
    <ScrollView style={css.container}>
      {tests.map((test, index) => (
        <View key={index} style={css.item}>
          <Text style={css.question}>{test.question}</Text>
          <View>
            {test.songoltuud.map((songolt, i) => (
              <TouchableOpacity
                disabled={shalgasan}
                key={i}
                style={css.songolt}
                activeOpacity={0.7}
                onPress={() => utgaUurchluh(index, i)}
              >
                <MaterialCommunityIcons
                  name={
                    hariulsan[index] === i
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color={hariulsan[index] === i ? main : dark}
                />
                {(() => {
                  const green = "#a4e170";
                  if (!shalgasan) return <Text>{songolt}</Text>;
                  else {
                    return i + 1 === tests[index].hariu ? (
                      <Text style={{ backgroundColor: green }}>{songolt}</Text>
                    ) : (
                      <Text>{songolt}</Text>
                    );
                  }
                })()}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Button disable={disabled} onPress={clicked}>
        {!shalgasan ? "Хариултаа шалгах" : "Эхлэх"}
      </Button>
      <View style={{ marginBottom: 30 }}></View>
    </ScrollView>
  );
};

export default TestScreen2;

const css = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  item: {
    marginVertical: 10,
  },
  question: {
    color: main,
    fontSize: 18,
    width: width - 20,
    fontFamily: w500,
  },
  songolt: {
    marginVertical: 5,
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});
