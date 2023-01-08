import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, FC, useEffect } from "react";
import Textfield from "../../../components/Textfield";
import FormPicker from "../../../components/FormPicker";
import { dark, light, main, w400, w500 } from "../../../constants";
import MyButton from "../../../components/Button";
import FormSwitch from "../../../components/FormSwitch";
import CalcContext from "../../../context/CalcContext";
import ResultModal from "../../../components/ResultModal";

type Value = {
  length1?: string;
  width1?: string;
  length2?: string;
  width2?: string;
  height?: string;
  sagginHeight?: string;
  surfaceHeight?: string;
};

type Error = {
  length1?: boolean;
  width1?: boolean;
  length2?: boolean;
  width2?: boolean;
  height?: boolean;
  sagginHeight?: boolean;
  surfaceHeight?: boolean;
};

const CoeffMethodScreen: FC = () => {
  const calcContext = useContext(CalcContext);
  // ##############################   ХУВЬСАГЧУУД   #########################################
  const [value, setValue] = useState<Value>({});
  const [error, setError] = useState<Error>({});
  const [privateLuminosity, setPrivateLuminosity] = useState<number>();
  const [numberLight, setNumberLight] = useState<number>(1);
  // Туслах өгөгдлүүд...
  const [buildingType, setBuildingType] = useState<string>("0");
  const [type, setType] = useState<string>("люминесцент");
  const [roomType, setRoomType] = useState<string>("0");
  const [lightType, setLightType] = useState<string>("0");
  const [twoRoom, setTwoRoom] = useState<boolean>(false);
  const [ro, setRo] = useState<string>("0");

  const [chadlaar, setChadlaar] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  // Тооцооны үр дүн ...
  const [result, setResult] = useState<number>();

  useEffect(() => {
    if (lightType === "0") setType("Люминесцент");
    else if (lightType === "1") setType("LED");
  }, [lightType]);

  // ########################################  ТАБЛИЦУУД #######################################
  // Стандарт гэрэлтэлтийн таблиц...
  const normalLuminosity = [
    [300, 500, 300, 400, 400, 150, 500, 400],
    [400],
    [500, 400, 300, 75, 150, 200, 300, 150],
    [400, 300, 200, 200, 75, 150, 300, 150],
    [200, 400, 150, 200],
    [100],
    [75, 150],
    [200, 300, 200, 200],
    [300, 400, 300, 200, 300],
    [
      75, 150, 75, 100, 400, 100, 200, 200, 75, 200, 50, 200, 300, 200, 750,
      200, 200, 200, 500, 50, 750, 750, 750, 300, 500, 300, 200, 150, 750, 200,
      200,
    ],
    [200, 200, 150],
    [
      500, 500, 300, 400, 500, 300, 20, 300, 200, 300, 50, 50, 200, 300, 400,
      200, 100, 200, 500, 300, 200, 500, 200, 300, 500, 200, 300, 75, 400, 200,
      50, 200, 400, 300, 500, 300, 200, 75, 400, 300, 200, 200, 300, 300, 200,
      200, 500, 300, 200, 75, 200, 200, 200, 100, 200, 50, 100, 150,
    ],
    [75, 150, 75, 100, 50, 75, 75, 50, 30, 10, 20],
  ];
  // Гэрлийн ашиглалтын таблиц...
  const UkTab = [
    // Uk массивийн индекс нь lightType-р тодорхойлогдоно...
    [
      // индекс нь ro-оор тодорхойлогдоно...
      [20, 26, 30, 33, 35, 38, 40, 41, 45, 47, 49, 51, 52, 54, 55, 56, 59], //70,50,10
      [17, 20, 24, 26, 29, 31, 33, 35, 38, 41, 42, 44, 46, 48, 49, 50, 53], // 50,30,10
      [10, 14, 17, 19, 21, 23, 25, 27, 30, 32, 33, 35, 36, 38, 39, 40, 43], // 0,0,0
    ], // Люминесцент ...
    [
      [33, 41, 47, 53, 58, 65, 70, 74, 79, 83],
      [32, 39, 45, 51, 55, 62, 67, 71, 75, 78],
      [25, 32, 38, 44, 48, 56, 61, 65, 70, 74],
      [30, 36, 42, 47, 51, 57, 61, 64, 68, 71],
    ], // LED ...
  ];
  // Өрөөний үзүүлэлт...
  const iTab = [
    [
      0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 3, 3.5, 4,
      5,
    ],
    [0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5],
  ];

  // ######################################## OPTIONS ##########################################
  //   Барилгын төрөл options...
  const buildingTypeOptions = [
    { label: "Захригаа, зураг төсөл, зохион бүтээх", value: "0" },
    { label: "Банк, санхүүгийн байгууллага", value: "1" },
    { label: "ЕБС, их дээд сургууль, коллеж", value: "2" },
    { label: "Чөлөөт цагаа өнгөрүүлэх газрууд", value: "3" },
    { label: "Цэцэрлэг", value: "4" },
    { label: "Сувилал, амралт", value: "5" },
    { label: "Биеийн тамир, эрүүл ахуйн газрууд", value: "6" },
    { label: "Нийтийн хоолны газар", value: "7" },
    { label: "Дэлгүүр", value: "8" },
    { label: "Ахуйн үйлчилгээний газрууд", value: "9" },
    { label: "Зочид буудал", value: "10" },
    { label: "Эмнэлэг", value: "11" },
    { label: "Бусад туслах өрөө, тасалгаанууд", value: "12" },
  ];
  // Өрөө тасалгааны өгөгдлүүдийн options
  const roomTypesOptions = [
    [
      { label: "Танхим, ажлын тасалгаа, хурлын танхим", value: "0" },
      { label: "Зураг төсөл, зохион бүтээх өрөө", value: "1" },
      { label: "Загварын, мужааны, засварын, мастерийн", value: "2" },
      { label: "Дэлгэцтэй ажиллах тасалгаанууд", value: "3" },
      { label: "Уншлагын танхим", value: "4" },
      { label: "Завсарлагын танхим", value: "5" },
      { label: "Аналитик лабораториуд", value: "6" },
      { label: "Лабораториуд", value: "7" },
    ],
    [{ label: "Ажилбарын танхим, зээлийн хэсэг, кассын танхим", value: "0" }],
    [
      { label: "Анги танхим, лаборатори, зураг зүйн танхимууд", value: "0" },
      { label: "Хөдөлмөр сургалтын танхим", value: "1" },
      { label: "Металл, мод боловсруулах мастерийн өрөө", value: "2" },
      { label: "Спорт, биеийн тамирын", value: "3" },
      { label: "Усан бассейн", value: "4" },
      { label: "Үзвэрийн ба кино танхим", value: "5" },
      { label: "Багш нарын өрөө, тасалгаанууд", value: "6" },
      { label: "Рекреацын", value: "7" },
    ],
    [
      { label: "Олон зориулалтын танхим", value: "0" },
      { label: "Театруудын үзвэр ба концертын танхим", value: "1" },
      {
        label: "Клубүүдийн үзвэрийн танхим, зочлох клуб, завсарлагын өрөө",
        value: "2",
      },
      { label: "Үзэсгэлэнгийн танхим", value: "3" },
      { label: "Кино театрын үзвэрийн танхим", value: "4" },
      { label: "Кино театрын завсарлагын танхим", value: "5" },
      { label: "Дугуйлангуудын өрөө, хөгжмийн анги", value: "6" },
      { label: "Кино, дуу, гэрлийн аппаратын өрөө", value: "7" },
    ],
    [
      { label: "Хүлээн авах, хувцас солих", value: "0" },
      {
        label:
          "Бүлгийн тоглоомын, хоолны, хөгжмийн тасалгаа, гимнастикийн хичээлийн",
        value: "1",
      },
      { label: "Унтлагын", value: "2" },
      { label: "Тусгаарлах, өвчилсөн хүүхдийн өрөө", value: "3" },
    ],
    [{ label: "Унтлагын өрөө, тасаг", value: "0" }],
    [
      { label: "Спорт тоглоомын танхим", value: "0" },
      { label: "Усан сангийн танхим", value: "1" },
    ],
    [
      { label: "Рестораны хоолны газрын хооллох танхим", value: "0" },
      { label: "Түгээх газар", value: "1" },
      { label: "Халуун хүйтэн цех, бэлтгэл цехүүд", value: "2" },
      {
        label: "Гуанзны сав, суулга, гал зуухны угаалга, талх зүсэх байр",
        value: "3",
      },
    ],
    [
      {
        label: "Худалдааны танхим, өөртөө үйлчлэхгүй хүнсний дэлгүүр",
        value: "0",
      },
      { label: "Өөртөө үйлчлэх хүнсний дэлгүүр", value: "1" },
      { label: "Хувцас өмсөх кабин", value: "2" },
      { label: "Захиалгын тасгийн байрууд, үйлчлэх товчоо", value: "3" },
      { label: "Төв кассын байр", value: "4" },
    ],
    [
      { label: "Халуун ус", value: "0" },
      { label: "Хүлээлгийн сэрүүцэх", value: "1" },
      { label: "Хувцас тайлах, угаалгын, шүршүүрийн, уурын", value: "2" },
      { label: "Усан сан", value: "3" },
      { label: "Үсчин", value: "4" },
      { label: "Гэрэл зураг авах танхим", value: "5" },
      { label: "Гэрэл зургийн лаборатори, уусмал бэлдэх", value: "6" },
      { label: "Угаалгын газрын хүлээн авах хэсэг", value: "7" },
      { label: "Угаалгын газрын цагаан хэрэглэл хадгалах", value: "8" },
      { label: "Угаалгын газрын уусмал бэлдэх", value: "9" },
      { label: "Угаалгын газрын угаасан материал хадгалах", value: "10" },
      { label: "Механикаар хатаах, индүүдэх", value: "11" },
      { label: "Гараар хатаах, индүүдэх", value: "12" },
      { label: "Хувцас цагаан хэрэглэл задлах, боох", value: "13" },
      { label: "Дотуур хувцас сэлбэх, засах", value: "14" },
      { label: "Өөртөө үйлчлэх угаалгын", value: "15" },
      { label: "Хими цэвэрлэгээний хувцас хүлээн авах", value: "16" },
      { label: "Хими цэвэрлэгээний байр", value: "17" },
      { label: "Хими цэвэрлэгээний толбо арилгах хэсэг", value: "18" },
      { label: "Химийн бодис хадгалах байр", value: "19" },
      { label: "Оёдлын цехүүд", value: "20" },
      { label: "Оёдлын газрын эсгэх тасаг", value: "21" },
      { label: "Хувцас засах тасаг", value: "22" },
      { label: "Оёдлын жижиг материалууд бэлтгэх тасаг", value: "23" },
      { label: "Гараар ба машинаар оёх тасаг", value: "24" },
      { label: "Оёдлын газрын индүү, уурын тасаг", value: "25" },
      { label: "АҮГ-ын хүлээн авах", value: "26" },
      { label: "Агуулах", value: "27" },
      { label: "Малгай засах, бэлтгэх, элдүүрийн ажил", value: "28" },
      { label: "Дуу бичлэгийн студийн бичих, сонсох", value: "29" },
      { label: "Авиа зүйн танхим", value: "30" },
    ],
    [
      { label: "Үйлчлэх хэсэг, ресепшин", value: "0" },
      { label: "Үйлчилгээний хүмүүсийн, жижүүрийн байр", value: "1" },
      { label: "Зочид буудлын өрөө, тасалгаанууд", value: "2" },
    ],
    [
      { label: "Хагалгааны өрөө, бага температурын хэсэг", value: "0" },
      { label: "Төрөх, диализ, сэхээн амьдруулах, боолтны өрөө", value: "1" },
      { label: "Мэс заслын өмнөх", value: "2" },
      { label: "Мэс заслын аппарат угсрах", value: "3" },
      {
        label:
          "Мэс засал, эх барих, эмэгтэйчүүд, гэмтэл,хүүхэд, халдварт, арьс өнгө, шүд, алергиний эмчийн өрөөнүүд, үзлэг, хүлээн авах боксын",
        value: "4",
      },
      { label: "Бусад амбулатори, поликлиникийн эмчийн өрөө", value: "5" },
      { label: "Нүдний эмчийн харанхуй өрөө", value: "6" },
      { label: "Онош зүй, дурангийн өрөөнүүд", value: "7" },
      { label: "Фотари, физик эмчилгээ, рентген, бронсхопи", value: "8" },
      { label: "Хөдөлмөр эмчилгээ", value: "9" },
      { label: "Нойроор эмчлэх", value: "10" },
      { label: "Рентген оношилгоо", value: "11" },
      { label: "Цээжний зураг, рентген зургийн", value: "12" },
      {
        label: "Цацраг идэвхит бодисын тун, шингээлт, тогтоох эмчилгээ",
        value: "13",
      },
      { label: "Гамма туяа эмчилгээ", value: "14" },
      {
        label:
          "Хүүхдийн, шинэ төрсөн хүүхэд, эрчимт эмчилгээ,мэс заслын дараах",
        value: "15",
      },
      {
        label: "Бусад тасаг, унтлагын өрөөнүүд, хүлээн авах, тусгаарлах",
        value: "16",
      },
      {
        label: "Лабораторийн дээж хүлээн авах, хариу өгөх, бүртгэх",
        value: "17",
      },
      { label: "Шинжилгээний, серологийн ба өнгөт урвалын", value: "18" },
      { label: "Урвалж бэлтгэх, жин хэмжүүр, центрфуг", value: "19" },
      { label: "Дуран, ходоодны шүүс авах", value: "20" },
      { label: "Шүдний техник, гипс, хуванцар", value: "21" },
      { label: "Эмийн сангийн үйлчилгээний танхим", value: "22" },
      { label: "Эмийн сангийн жорын хэсэг, бэлэн эмийн тасаг", value: "23" },
      { label: "Эмийн сангийн туслах, ариутгал, савлах", value: "24" },
      {
        label: "Ариутгал, автоклав, багаж бэлтгэх, материал хүлээн авах",
        value: "25",
      },
      { label: "Багаж засах, ирлэх", value: "26" },
      { label: "Халдваргүйжүүлэх камер", value: "27" },
      { label: "Задлан шинжилгээ", value: "28" },
      { label: "Задлан шинжилгээний өмнөх, бэхжүүлэх, гашуудлын", value: "29" },
      {
        label: "Шарил хадгалах, оршуулах ёслолын хэрэглэл хадгалах",
        value: "30",
      },
      { label: "Диспетчерийн, багаж олгох", value: "31" },
      { label: "Биохимийн лаборатори, эдийн шинжилгээ, урвалж", value: "32" },
      {
        label:
          "Радио хими, спектроскопи, дуу, доргио, цахилгаан соронзон орон, холимог бодисын шинжилгээ",
        value: "33",
      },
      {
        label:
          "Халдвар судлагч, бактериологич, гоц халдварт өвчин, шимэгч судлал",
        value: "34",
      },
      {
        label: "Тэжээлт орчны дээж авах, хагас тусгаарлагатай өрөө",
        value: "35",
      },
      { label: "Халдваргүйжүүлэх, ариутгал", value: "36" },
      { label: "Амьтны хүүр, хаягдал шатаах", value: "37" },
      { label: "Вивари, амьтан байрлуулах, тэжээх", value: "38" },
      { label: "Диспетчерийн", value: "39" },
      { label: "Радиопост", value: "40" },
      { label: "Дуудлагын багийнхан байрлах", value: "41" },
      { label: "Цагаан хоол шүүж савлах", value: "42" },
      { label: "Бүтээгдэхүүн бэлтгэж савлах", value: "43" },
      { label: "Аяга таваг хүлээн авч, хадгалах, тараах", value: "44" },
      { label: "Бүртгэл", value: "45" },
      { label: "Гардан үйлдлийн", value: "46" },
      { label: "Сувилагчийн өрөө, пост", value: "47" },
      { label: "Тоног төхөөрөмжийн өрөө", value: "48" },
      { label: "Конденсатор, регенераторын", value: "49" },
      { label: "Шил үлээх", value: "50" },
      { label: "Ариутгал, угаалга, цагаан хэрэглэл", value: "51" },
      { label: "Цус, биологийн бодис хадгалах", value: "52" },
      {
        label:
          "Урвалж, лабораторийн сав, эмийн болон боолтны материал хадгалах",
        value: "53",
      },
      { label: "Хайрцаг савны агуулах", value: "54" },
      { label: "Сэрүүн тавцан", value: "55" },
      { label: "Эмнэлэгийн хонгил", value: "56" },
    ],
    [
      { label: "Үүдний өрөө, хувцасны өлгүүр", value: "0" },
      {
        label: "Сургууль, театр, клуб, зочид буудлын гол хаалганы хэсэг",
        value: "1",
      },
      { label: "Бусад олон нийтийн барилгын гол хаалга", value: "2" },
      { label: "Гол шатны хэсэг", value: "3" },
      { label: "Бусад шатны хэсэг", value: "4" },
      { label: "Цахилгаан шатны өмнөх хэсэг", value: "5" },
      { label: "Гол хонгил, гарах замууд", value: "6" },
      { label: "Бусад хонгилууд", value: "7" },
      { label: "Цахилгаан шатны машины хэсэг", value: "8" },
      { label: "Дээврийн хөндий", value: "9" },
      { label: "Техникийн болон цахилгааны өрөө", value: "10" },
    ],
  ];
  // Гэрлийн төрлийн options...
  const lightTypeOptions = [
    { label: "Люминесцент чийдэнтэй (ЛПО-02)", value: "0" },
    { label: "LED чийдэнтэй", value: "1" },
  ];
  // Хана, тааз, шалны ойлтын коэффициент...
  const roOptions = [
    [
      { label: "70%, 50%, 10%", value: "0" },
      { label: "50%, 30%, 10%", value: "1" },
      { label: "0%, 0%, 0%", value: "2" },
    ],
    [
      { label: "80%, 50%, 30%", value: "0" },
      { label: "70%, 50%, 30%", value: "1" },
      { label: "70%, 30%, 30%", value: "2" },
      { label: "50%, 50%, 30%", value: "3" },
    ],
  ];
  // Стандарт чадлын гэрлийн урсгалын options...
  const loadOptions = [
    [
      { label: "15 Вт", value: "720" },
      { label: "20 Вт", value: "1100" },
      { label: "30 Вт", value: "1600" },
      { label: "40 Вт", value: "2850" },
      { label: "65 Вт", value: "4300" },
      { label: "80 Вт", value: "4900" },
    ],
    [
      { label: "8-10 Вт", value: "600" },
      { label: "12-14 Вт", value: "1100" },
      { label: "16-18 Вт", value: "1400" },
      { label: "20 Вт", value: "1800" },
      { label: "34 Вт", value: "2800" },
      { label: "45 Вт", value: "4670" },
      { label: "50 Вт", value: "5800" },
      { label: "65 Вт", value: "7840" },
      { label: "100 Вт", value: "13000" },
    ],
  ];
  // Гэрлийн шилний тоо options...
  const numberLightOptions = [
    [
      { label: "Нэг гэрлийн шилтэй", value: 1 },
      { label: "Хоёр гэрлийн шилтэй", value: 2 },
      { label: "Гурван гэрлийн шилтэй", value: 3 },
      { label: "Дөрвөн гэрлийн шилтэй", value: 4 },
    ],
    [{ label: "Нэг гэрлийн шилтэй", value: 1 }],
  ];
  // Өрөөний хэлбэрийн options...
  const roomGeometricOptions = [
    { label: "Тэгш өнцөгт", value: "0" },
    { label: "Доголтой", value: "1" },
  ];

  // ############################# FORM-ТОЙ АЖИЛЛАХ ФУНКЦУУД ##################################
  const valueChanger = (
    text: string,
    id: keyof Value | [keyof Value],
    validation?: [number, number]
  ) => {
    const key = typeof id === "object" ? id[0] : id;
    if (text !== "") {
      if (validation) {
        if (
          parseFloat(text) < validation[0] ||
          validation[1] < parseFloat(text)
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
        copy[key] = text;

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

  const reset = () => {
    setValue({});
    setResult(0);
    setBuildingType("0");
    setRoomType("0");
    setTwoRoom(false);
    setLightType("0");
    setNumberLight(1);
    setVisible(false);
  };

  useEffect(() => {
    if (
      error.height ||
      error.length1 ||
      error.length2 ||
      error.sagginHeight ||
      error.surfaceHeight ||
      error.width1 ||
      error.width2 ||
      !privateLuminosity ||
      !value.height ||
      !value.length1 ||
      !value.width1
    )
      setDisabled(true);
    else setDisabled(false);
  }, [value, error, privateLuminosity]);

  // ##################################  ТООЦООЛОХ ФУНКЦУУД  ##################################
  const publicCalc = (length: number, width: number, area: number) => {
    if (calcContext) {
      // Стандарт гэрэлтэлт...
      const luminosityNormal =
        normalLuminosity[parseInt(buildingType)][parseInt(roomType)];
      // Гэрлийн шилний тоо, нэг гэрлийн F...
      const num = numberLight;
      const Fp = privateLuminosity ? privateLuminosity : 1;
      // Нөөцийн коэффициент...
      const z = 1.15;
      const k = 1.5;
      const gerliinUnjilt = value.sagginHeight
        ? parseFloat(value.sagginHeight)
        : 0;
      const ajliinGadarguu = value.surfaceHeight
        ? parseFloat(value.surfaceHeight)
        : 0;
      const height = value.height ? parseFloat(value.height) : undefined;

      const gerelOgolt = height ? height - ajliinGadarguu - gerliinUnjilt : 0;
      const hurt = area;
      const huw = (length + width) * gerelOgolt;
      const i = hurt / huw;

      // Гэрлийн ашиглалт...
      let Uk = 0;
      // Гэрлийн ашиглалт тодорхойлох...
      if (i <= 0.5) {
        if (lightType === "0" && ro === "0") Uk = 20;
        else if (lightType === "0" && ro === "1") Uk = 17;
        else if (lightType === "0" && ro === "2") Uk = 10;
        else if (lightType === "1" && ro === "0") Uk = 33;
        else if (lightType === "1" && ro === "1") Uk = 32;
        else if (lightType === "1" && ro === "2") Uk = 25;
        else if (lightType === "1" && ro === "3") Uk = 30;
      } else if (i >= 5) {
        if (lightType === "0" && ro === "0") Uk = 59;
        else if (lightType === "0" && ro === "1") Uk = 53;
        else if (lightType === "0" && ro === "2") Uk = 43;
        else if (lightType === "1" && ro === "0") Uk = 83;
        else if (lightType === "1" && ro === "1") Uk = 78;
        else if (lightType === "1" && ro === "2") Uk = 74;
        else if (lightType === "1" && ro === "3") Uk = 71;
      } else {
        Uk = calcContext.interpolation(
          i,
          iTab[parseInt(lightType)],
          UkTab[parseInt(lightType)][parseInt(ro)]
        );
      }
      const Ku = Uk / 100;
      const hurtwer = luminosityNormal * k * z * area;
      const F = hurtwer / Ku;
      const Np = F / Fp;
      const Nbut = Np / num;
      const n = Math.ceil(Nbut);

      return n;
    } else return 0;
  };

  const calc = () => {
    let n1 = 0;
    let n2 = 0;

    if (!twoRoom) {
      if (value.length1 && value.width1) {
        n1 = publicCalc(
          parseFloat(value.length1),
          parseFloat(value.width1),
          parseFloat(value.length1) * parseFloat(value.width1)
        );
      }
    } else {
      if (value.length1 && value.length2 && value.width1 && value.width2) {
        n1 = publicCalc(
          parseFloat(value.length1),
          parseFloat(value.width1),
          parseFloat(value.length1) * parseFloat(value.width1)
        );

        n2 = publicCalc(
          parseFloat(value.length2),
          parseFloat(value.width2),
          parseFloat(value.length2) * parseFloat(value.width2)
        );
      }
    }

    const n = n1 + n2;
    setResult(n);
    setVisible(true);
  };

  return (
    <ScrollView style={css.container}>
      <ResultModal
        visible={visible}
        setVisible={setVisible}
        title="Тооцооны хариу"
        reset={reset}
      >
        <Text style={css.subtitle}>Өгөгдөл</Text>
        {(() => {
          const data = [
            {
              label: "Барилгын төрөл",
              value: buildingTypeOptions[parseInt(buildingType)].label,
              unit: null,
            },
            {
              label: "Өрөөний зориулалт",
              value:
                roomTypesOptions[parseInt(buildingType)][parseInt(roomType)]
                  .label,
              unit: null,
            },
            {
              label: "Гэрлийн үүсгүүр",
              value: type,
              unit: null,
            },
            {
              label: "Нэг гэрэлтүүлэгч доторх гэрлийн шилний тоо",
              value: numberLight,
              unit: "ширхэг",
            },
            {
              label: "Гэрлийн шилний гэрлийн урсгал",
              value: privateLuminosity,
              unit: "Лм",
            },
            {
              label: "Гэрэлтүүлэгчийн гэрлийн урсгал",
              value: privateLuminosity ? privateLuminosity * numberLight : 0,
              unit: "Лм",
            },
            {
              label: "Өрөөний шаардагдах гэрэлтэлт",
              value:
                normalLuminosity[parseInt(buildingType)][parseInt(roomType)],
              unit: "Лк",
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
              label: "Шаардагдах гэрэлтүүлэгчийн тоо",
              unit: "ширхэг",
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
                          {result}
                        </Text>
                      )}
                    </Text>
                  </View>
                );
              })}
            </>
          );
        })()}
      </ResultModal>
      <FormPicker
        label="Барилгын төрөл"
        icon="office-building"
        options={buildingTypeOptions}
        onValueChange={(value) => setBuildingType(value)}
        value={buildingType ? buildingType : "0"}
      />
      <FormPicker
        label="Өрөөний зориулалт"
        icon="blur"
        options={roomTypesOptions[parseInt(buildingType)]}
        onValueChange={(value) => setRoomType(value)}
        value={roomType ? roomType : "0"}
      />
      <FormPicker
        label="Өрөөний хэлбэр"
        icon={twoRoom ? "watermark" : "rectangle"}
        options={roomGeometricOptions}
        onValueChange={(value) => setTwoRoom(value == "1")}
        value={twoRoom ? "1" : "0"}
      />
      <FormPicker
        label="Гэрлийн үүсгүүрийн төрөл"
        icon="lightbulb-cfl"
        options={lightTypeOptions}
        onValueChange={(value) => setLightType(value)}
        value={lightType ? lightType + "" : "0"}
      />

      <FormPicker
        label="Нэг гэрэлтүүлэгч доторх гэрлийн шилний тоо"
        icon="alpha-n"
        options={numberLightOptions[parseInt(lightType)]}
        onValueChange={(value) => setNumberLight(parseInt(value))}
        value={numberLight ? numberLight + "" : "0"}
      />

      <FormSwitch
        icon={chadlaar ? "alpha-p" : "alpha-f"}
        onValueChange={setChadlaar}
        trueText="Стандарт чадлаар"
        falseText="Стандарт гэрлийн урсгалаар"
        value={chadlaar}
        label="Нэг гэрлийн шилний үйлдвэрийн стандарт гэрлийн урсгалыг :"
      />

      {chadlaar ? (
        <FormPicker
          options={loadOptions[parseInt(lightType)]}
          value={privateLuminosity ? privateLuminosity + "" : ""}
          label="Гэрлийн шилний чадал"
          icon="solar-power"
          onValueChange={(value) => setPrivateLuminosity(parseInt(value))}
        />
      ) : (
        <Textfield
          label="Нэг гэрлийн шилний хувийн тооцооны гэрлийн урсгал, Лм"
          placeholder="10000 хүртэл утга оруулна уу"
          icon="alarm-light-outline"
          keyboardType="numeric"
          value={privateLuminosity ? privateLuminosity + "" : ""}
          onChangeText={(value) => setPrivateLuminosity(parseInt(value))}
          error={{
            text: "Та 1-10000Лм хүртэл утга оруулна уу",
            show: privateLuminosity
              ? privateLuminosity < 1 || privateLuminosity > 10000
              : false,
          }}
        />
      )}

      <FormPicker
        label="Хана, тааз, шалны ойлтын коэффициент"
        icon="leak"
        options={roOptions[parseInt(lightType)]}
        onValueChange={(value) => setRo(value)}
        value={ro ? ro + "" : "0"}
      />
      <Textfield
        label="Өрөөний өндөр, (м)"
        placeholder="2.5-12 хүртэл утга оруулна уу"
        icon={"alpha-h"}
        keyboardType="numeric"
        value={value.height ? value.height + "" : ""}
        onChangeText={(value) => valueChanger(value, ["height"], [2.5, 12])}
        error={{
          text: "Та 2.5-12м хүртэл уртын утга оруулна уу",
          show: error.height,
        }}
      />
      <Textfield
        label={
          !twoRoom ? "Өрөөний урт, өргөн, м" : "Үндсэн өрөөний урт, өргөн, м"
        }
        placeholder={["Урт, м", "Өргөн, м"]}
        icon={["alpha-a", "alpha-b"]}
        keyboardType="numeric"
        check
        value={[
          value.length1 ? value.length1 + "" : "",
          value.width1 ? value.width1 + "" : "",
        ]}
        onChangeText={(value) => valueChanger(value, "length1", [0, 100])}
        checkChangeText={(value) => valueChanger(value, "width1", [0, 100])}
        error={{
          text: "Та 100м хүртэл утга оруулна уу",
          show: error.length1 || error.width1,
        }}
      />

      {twoRoom ? (
        <Textfield
          label="Догол өрөөний урт, өргөн, м"
          placeholder={["Урт, м", "Өргөн, м"]}
          icon={["alpha-c", "alpha-d"]}
          keyboardType="numeric"
          check
          value={[
            value.length2 ? value.length2 + "" : "",
            value.width2 ? value.width2 + "" : "",
          ]}
          onChangeText={(value) => valueChanger(value, "length2", [0, 20])}
          checkChangeText={(value) => valueChanger(value, "width2", [0, 20])}
          error={{
            text: "Та 20м хүртэл утга оруулна уу",
            show: error.length2 || error.width2,
          }}
        />
      ) : null}

      <Textfield
        label="Гэрлийн унжилт, ажлын гадаргуугийн өндөр, м"
        placeholder={["Унжилт, м", "Гадаргуу, м"]}
        icon={["ceiling-light", "laptop"]}
        keyboardType="numeric"
        check
        value={[
          value.sagginHeight ? value.sagginHeight + "" : "",
          value.surfaceHeight ? value.surfaceHeight + "" : "",
        ]}
        onChangeText={(value) => valueChanger(value, "sagginHeight", [0, 1])}
        checkChangeText={(value) =>
          valueChanger(value, "surfaceHeight", [0, 1.5])
        }
        error={{
          text: error.sagginHeight
            ? "Та 1м хүртэл утга оруулна уу"
            : "Та 1.5м хүртэл утга оруулна уу",
          show: error.sagginHeight || error.surfaceHeight,
        }}
      />
      <MyButton disable={disabled} onPress={calc}>
        Тооцоолох
      </MyButton>
      <View style={{ marginBottom: 20 }}></View>
    </ScrollView>
  );
};

export default CoeffMethodScreen;

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
