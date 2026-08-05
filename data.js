// ============================================================
// STUDYTRACK PLATFORM EXAM DATA
// ============================================================

const EXAMS_DATA = {
  yks: {
    title: "YKS 2027",
    subTitle: "TYT + AYT Sınavı",
    countdownTarget: "2027-06-19T10:00:00",
    modules: {
      tyt: {
        label: "TYT (Temel Yeterlilik)",
        subjects: [
          {
            id: "tyt_turkce",
            label: "Türkçe",
            icon: "📖",
            color: "#06b6d4",
            units: [
              { title: "Sözcükte Anlam", topics: ["Gerçek, Mecaz, Terim Anlam", "Eş, Zıt, Yakın Anlam", "Deyimler ve Atasözleri", "Sözcükler Arası Anlam İlişkileri"] },
              { title: "Cümlede Anlam", topics: ["Cümlede Anlam İlişkileri", "Amaç-Sonuç, Neden-Sonuç, Koşul", "Varsayım, Çıkarım, Öneri", "Duygu ve Düşünce Cümleleri"] },
              { title: "Paragrafta Anlam", topics: ["Ana Fikir ve Yardımcı Fikirler", "Paragrafın Yapısı ve Bölümleri", "Paragraf Tamamlama ve Sıralama", "Anlatım Biçimleri ve Geliştirme Yolları"] },
              { title: "Ses Bilgisi", topics: ["Ünlü Uyumları ve Daralması", "Ünsüz Yumuşaması ve Benzeşmesi", "Ses Düşmesi ve Türemesi"] },
              { title: "Yazım Kuralları", topics: ["Büyük Harflerin Kullanımı", "Birleşik Kelimelerin Yazımı", "Sayılar, Kısaltmalar ve Eklerin Yazımı"] },
              { title: "Noktalama İşaretleri", topics: ["Nokta, Virgül, Noktalı Virgül", "İki Nokta, Üç Nokta", "Soru, Ünlem, Tırnak ve Kesme İşareti"] },
              { title: "Sözcük Türleri", topics: ["İsim, Sıfat, Zamir", "Zarf, Edat, Bağlaç, Ünlem", "Fiiller, Fiilde Kip ve Zaman", "Ek-Fiil ve Fiilimsiler"] },
              { title: "Cümlenin Ögeleri ve Çatı", topics: ["Özne, Yüklem, Tümleçler", "Fiilde Çatı (Etken, Edilgen, Geçişli vb.)"] },
              { title: "Cümle Türleri ve Bozukluklar", topics: ["Yapısına Göre Cümleler", "Anlama Dayalı Anlatım Bozuklukları", "Dil Bilgisine Dayalı Bozukluklar"] }
            ]
          },
          {
            id: "tyt_matematik",
            label: "Matematik",
            icon: "🔢",
            color: "#6366f1",
            units: [
              { title: "Temel Kavramlar", topics: ["Sayı Kümeleri", "Tek, Çift, Ardışık Sayılar", "Asal Sayılar ve Faktöriyel"] },
              { title: "Sayı Basamakları ve Çözümleme", topics: ["Basamak Değeri ve Çözümleme", "Bölme ve Bölünebilme Kuralları", "Asal Çarpanlar, EBOB ve EKOK"] },
              { title: "Rasyonel ve Ondalık Sayılar", topics: ["Rasyonel Sayı İşlemleri", "Ondalık Sayılar ve Devirli Sayılar", "Sıralama ve Eşitsizlikler"] },
              { title: "Birinci Dereceden Denklemler", topics: ["Birinci Dereceden Bir Bilinmeyenli Denklemler", "Mutlak Değer Özellikleri ve Eşitsizlikler"] },
              { title: "Üslü ve Köklü İfadeler", topics: ["Üslü Sayı Kuralları ve Denklemleri", "Köklü Sayı Kuralları ve İşlemleri"] },
              { title: "Oran - Orantı ve Problemler", topics: ["Oran ve Orantı Özellikleri", "Sayı ve Kesir Problemleri", "Yaş, İşçi ve Havuz Problemleri", "Yüzde, Kâr-Zarar ve Karışım Problemleri", "Hareket ve Grafik Problemleri"] },
              { title: "Kümeler ve Mantık", topics: ["Kümelerde İşlemler ve Alt Küme", "Kartezyen Çarpım", "Mantık Önermeleri ve Bağlaçlar"] },
              { title: "Fonksiyonlar", topics: ["Fonksiyon Tanımı ve Değer Bulma", "Bileşke ve Ters Fonksiyon", "Fonksiyon Grafikleri"] },
              { title: "Polinomlar ve Çarpanlara Ayırma", topics: ["Polinom İşlemleri ve Kalan Bulma", "Özdeşlikler ve Çarpanlara Ayırma Yöntemleri"] },
              { title: "Sayma, Permütasyon, Kombinasyon", topics: ["Toplama ve Çarpma Yoluyla Sayma", "Permütasyon ve Kombinasyon Hesapları", "Binom Açılımı ve Olasılık Hesabı"] }
            ]
          },
          {
            id: "tyt_geometri",
            label: "Geometri",
            icon: "📐",
            color: "#10b981",
            units: [
              { title: "Doğruda ve Üçgende Açılar", topics: ["Açı Türleri ve Doğruda Açı", "Üçgende Açı Özellikleri"] },
              { title: "Üçgenler", topics: ["Özel Üçgenler (Dik, İkizkenar, Eşkenar)", "Üçgende Kenarortay, Açıortay, Yükseklik", "Üçgende Eşlik ve Benzerlik", "Üçgende Alan Formülleri"] },
              { title: "Çokgenler ve Dörtgenler", topics: ["Düzgün Çokgenler ve Özellikleri", "Deltoid, Yamuk, Paralelkenar", "Eşkenar Dörtgen, Dikdörtgen, Kare"] },
              { title: "Çember ve Daire", topics: ["Çemberde Açı ve Teğet Özellikleri", "Çemberin Çevresi ve Dairenin Alanı"] },
              { title: "Analitik Geometri ve Katı Cisimler", topics: ["Noktanın ve Doğrunun Analitiği", "Prizma, Piramit, Silindir, Koni ve Küre"] }
            ]
          },
          {
            id: "tyt_fizik",
            label: "Fizik",
            icon: "⚡",
            color: "#f59e0b",
            units: [
              { title: "Fizik Bilimine Giriş", topics: ["Fiziksel Niceliklerin Sınıflandırılması", "Bilimsel Araştırma Merkezleri"] },
              { title: "Madde ve Özellikleri", topics: ["Kütle, Hacim, Özkütle", "Dayanıklılık, Yapışma (Adezyon) ve Tutma (Kohezyon)"] },
              { title: "Hareket ve Kuvvet", topics: ["Konum, Hız, İvme Grafikleri", "Kuvvet ve Newton'ın Hareket Yasaları", "Sürtünme Kuvveti"] },
              { title: "İş, Enerji ve Güç", topics: ["Mekanik İş ve Güç", "Kinetik, Potansiyel Enerji ve Korunumu", "Verim ve Enerji Kaynakları"] },
              { title: "Isı ve Sıcaklık", topics: ["Isı, Sıcaklık ve İç Enerji kavramları", "Hal Değişimi ve Isıl Denge", "Isı İletim Yolları ve Genleşme"] },
              { title: "Elektrostatik ve Elektrik", topics: ["Elektriksel Yüklenme ve Coulomb Yasası", "Elektrik Akımı, Direnç ve Ohm Yasası", "Seri-Paralel Bağlama ve Mıknatıslar"] },
              { title: "Basınç ve Kaldırma Kuvveti", topics: ["Katı, Sıvı, Gaz Basıncı", "Sıvıların Kaldırma Kuvveti ve Arşimet"] },
              { title: "Dalgalar ve Optik", topics: ["Yay, Su, Ses ve Deprem Dalgaları", "Aydınlanma, Gölge, Yansıma ve Aynalar", "Kırılma, Renkler ve Mercekler"] }
            ]
          },
          {
            id: "tyt_kimya",
            label: "Kimya",
            icon: "🧪",
            color: "#ec4899",
            units: [
              { title: "Kimya Bilimi", topics: ["Simyadan Kimyaya Geçiş", "Kimya Disiplinleri ve Çalışma Alanları", "Kimya Laboratuvarında Güvenlik Kuralları"] },
              { title: "Atom ve Periyodik Sistem", topics: ["Atom Modelleri ve Atomun Yapısı", "Periyodik Sistem ve Elementlerin Sınıflandırılması", "Periyodik Özelliklerin Değişimi"] },
              { title: "Kimyasal Türler Arası Etkileşimler", topics: ["Kimyasal Tür Kavramı ve Sınıflandırma", "Güçlü Etkileşimler (İyonik, Kovalent, Metalik)", "Zayıf Etkileşimler (Van der Waals, Hidrojen Bağı)"] },
              { title: "Maddenin Fiziksel Halleri", topics: ["Katılar, Sıvılar (Viskozite, Buharlaşma vb.)", "Gazlar ve Plazma Hali"] },
              { title: "Doğa ve Kimya", topics: ["Su ve Hayat", "Çevre Kimyası (Hava, Toprak, Su Kirliliği)"] },
              { title: "Kimyanın Temel Kanunları ve Mol", topics: ["Kütlenin Korunumu, Sabit Oranlar Kanunu", "Mol Kavramı ve Hesaplamaları", "Kimyasal Tepkimeler ve Hesaplamalar"] },
              { title: "Karışımlar ve Ayırma", topics: ["Homojen ve Heterojen Karışımlar", "Derişim Birimleri (Kütlece %, Hacimce %)", "Karışımları Ayırma Teknikleri"] },
              { title: "Asitler, Bazlar ve Tuzlar", topics: ["Asit-Baz Tanımı ve Özellikleri", "Nötrleşme Tepkimeleri ve pH", "Tuzların Özellikleri ve Kullanım Alanları"] },
              { title: "Kimya Her Yerde", topics: ["Temizlik Maddeleri ve Polimerler", "Kozmetikler, İlaçlar ve Hazır Gıdalar"] }
            ]
          },
          {
            id: "tyt_biyoloji",
            label: "Biyoloji",
            icon: "🧬",
            color: "#22c55e",
            units: [
              { title: "Canlıların Ortak Özellikleri", topics: ["Beslenme, Solunum, Boşaltım", "Hareket, Uyarılara Tepki, Uyum", "Üreme, Büyüme ve Gelişme"] },
              { title: "Canlıların Temel Bileşenleri", topics: ["İnorganik Bileşikler (Su, Mineraller vb.)", "Organik Bileşikler (Karbonhidrat, Yağ, Protein)", "Enzimler, Hormonlar ve Vitaminler", "Nükleik Asitler (DNA, RNA) ve ATP"] },
              { title: "Hücre ve Yapısı", topics: ["Hücre Teorisi, Prokaryot ve Ökaryot Hücreler", "Hücre Organelleri ve Görevleri", "Hücre Zarından Madde Geçişleri"] },
              { title: "Canlılar Dünyası ve Sınıflandırma", topics: ["Sınıflandırma İlkeleri ve Kategoriler", "Bakteriler, Arkeler, Protistalar", "Bitkiler, Mantarlar, Hayvanlar ve Virüsler"] },
              { title: "Hücre Bölünmeleri ve Üreme", topics: ["Mitoz Bölünme ve Eşeysiz Üreme", "Mayoz Bölünme ve Eşeyli Üreme"] },
              { title: "Kalıtım ve Genetik", topics: ["Mendel Genetiği ve Çaprazlamalar", "Kan Grupları ve Eşeye Bağlı Kalıtım", "Soyağaçları ve Genetik Varyasyonlar"] },
              { title: "Ekosistem Ekolojisi", topics: ["Ekosistemin Yapısı, Canlı ve Cansız Etmenler", "Besin Zinciri ve Enerji Akışı", "Madde Döngüleri ve Çevre Sorunları"] }
            ]
          }
        ]
      },
      ayt: {
        label: "AYT (Alan Yeterlilik)",
        subjects: [
          {
            id: "ayt_matematik",
            label: "İleri Matematik",
            icon: "📊",
            color: "#6366f1",
            units: [
              { title: "Denklem ve Eşitsizlik Sistemleri", topics: ["İkinci Dereceden Bir Bilinmeyenli Eşitsizlikler", "Eşitsizlik Sistemleri ve Grafikler"] },
              { title: "Fonksiyonlarda Uygulamalar", topics: ["Fonksiyon Grafiğinde Dönüşümler", "İkinci Dereceden Fonksiyonlar (Parabol)"] },
              { title: "Trigonometri", topics: ["Yönlü Açılar ve Trigonometrik Fonksiyonlar", "Toplam-Fark ve Yarım Açı Formülleri", "Trigonometrik Denklemler"] },
              { title: "Logaritma", topics: ["Üstel ve Logaritmik Fonksiyonlar", "Logaritma Özellikleri ve Denklemleri"] },
              { title: "Diziler", topics: ["Dizi Kavramı ve Gösterimi", "Aritmetik Dizi", "Geometrik Dizi"] },
              { title: "Limit ve Süreklilik", topics: ["Limit Kavramı ve Sağ-Sol Limit", "Belirsizlik Durumları (0/0)", "Süreklilik Tanımı"] },
              { title: "Türev ve Uygulamaları", topics: ["Türev Tanımı ve Kuralları", "Teğet ve Normal Denklemleri", "Maksimum ve Minimum Problemleri", "Fonksiyon Grafiklerinin Çizimi"] },
              { title: "İntegral ve Uygulamaları", topics: ["Belirsiz İntegral ve Değişken Değiştirme", "Belirli İntegral ve Riemann Toplamı", "İntegral ile Alan Hesabı"] }
            ]
          },
          {
            id: "ayt_fizik",
            label: "İleri Fizik",
            icon: "🔬",
            color: "#f59e0b",
            units: [
              { title: "Kuvvet ve Hareket (Mekanik)", topics: ["Vektörler ve Bağıl Hareket", "Newton'ın Hareket Yasaları Uygulamaları", "İki Boyutta Sabit İvmeli Hareket (Atışlar)", "İtme ve Çizgisel Momentum", "Tork, Denge ve Basit Makineler"] },
              { title: "Elektrik ve Manyetizma", topics: ["Elektriksel Alan ve Potansiyel", "Sığaçlar ve Kondansatörler", "Manyetik Alan ve Manyetik Kuvvet", "Elektromanyetik İndüksiyon ve Alternatif Akım", "Transformatörler"] },
              { title: "Çembersel Hareket ve Kütle Çekimi", topics: ["Düzgün Çembersel Hareket", "Açısal Momentum ve Eylemsizlik Momenti", "Kepler Kanunları ve Kütle Çekimi"] },
              { title: "Basit Harmonik Hareket", topics: ["Harmonik Hareketin Temel Kavramları", "Yay Sarkacı ve Basit Sarkaç"] },
              { title: "Dalga Mekaniği", topics: ["Işıkta Girişim, Kırınım ve Doppler", "Elektromanyetik Dalgalar"] },
              { title: "Modern Fizik ve Teknolojideki Uygulamalar", topics: ["Özel Görelilik", "Fotoelektrik ve Compton Saçılması", "Yarı İletken Teknolojisi ve Nanoteknoloji"] }
            ]
          },
          {
            id: "ayt_kimya",
            label: "İleri Kimya",
            icon: "⚗️",
            color: "#ec4899",
            units: [
              { title: "Modern Atom Teorisi", topics: ["Atomun Kuantum Modeli ve Orbitaller", "Elektron Dizilimleri ve Periyodik Özellikler", "Yükseltgenme Basamakları"] },
              { title: "Gazlar", topics: ["Gaz Yasaları ve İdeal Gaz Denklemi", "Kısmi Basınç ve Kinetik Teori", "Gaz Karışımları ve Gerçek Gazlar"] },
              { title: "Sıvı Çözeltiler ve Çözünürlük", topics: ["Molarite, Molalite ve Derişim Birimleri", "Koligatif Özellikler", "Çözünürlüğe Etki Eden Faktörler"] },
              { title: "Kimyasal Tepkimelerde Enerji ve Hız", topics: ["Tepkime Entalpisi ve Hess Yasası", "Tepkime Hızını Etkileyen Faktörler"] },
              { title: "Kimyasal Denge", topics: ["Denge Bağıntısı ve Le Chatelier İlkesi", "Asit-Baz Dengesi ve Titrasyon", "Çözünme-Çökelme Dengesi (Kçç)"] },
              { title: "Kimya ve Elektrik", topics: ["Redoks Tepkimeleri ve Aktiflik", "Elektrokimyasal Piller ve Nernst Eşitliği", "Elektroliz ve Korozyon"] },
              { title: "Karbon Kimyasına Giriş ve Organik", topics: ["Anorganik ve Organik Bileşikler", "Lewis Yapıları ve Hibritleşme", "Alkanlar, Alkenler, Alkinler", "Fonksiyonel Gruplar, Alkoller ve Eterler"] }
            ]
          },
          {
            id: "ayt_biyoloji",
            label: "İleri Biyoloji",
            icon: "🦠",
            color: "#22c55e",
            units: [
              { title: "İnsan Fizyolojisi (Sistemler)", topics: ["Denetleyici ve Düzenleyici Sistem (Sinir/Endokrin)", "Duyu Organları", "Destek ve Hareket Sistemi", "Sindirim, Dolaşım ve Bağışıklık Sistemi", "Solunum ve Boşaltım Sistemi", "Üreme Sistemi ve Embriyonik Gelişim"] },
              { title: "Komünite ve Popülasyon Ekolojisi", topics: ["Komünite Ekolojisi ve Türler Arası İlişkiler", "Popülasyon Ekolojisi ve Grafikler"] },
              { title: "Genden Proteine", topics: ["Nükleik Asitlerin Keşfi ve Yapısı", "DNA Replikasyonu", "Genetik Şifre ve Protein Sentezi"] },
              { title: "Canlılarda Enerji Dönüşümleri", topics: ["Hücresel Solunum (Aerobik/Anaerobik)", "Fotosentez ve Kemosentez Reaksiyonları"] },
              { title: "Bitki Biyolojisi", topics: ["Bitki Dokuları ve Organları", "Bitkilerde Madde Taşınması ve Hormonlar", "Bitkilerde Hareket ve Üreme"] }
            ]
          }
        ]
      }
    }
  },

  kpss: {
    title: "KPSS 2027",
    subTitle: "Kamu Personeli Seçme Sınavı (Lisans/Önlisans)",
    countdownTarget: "2027-07-18T10:00:00",
    modules: {
      genel_yetenek: {
        label: "Genel Yetenek Sınavı",
        subjects: [
          {
            id: "kpss_turkce",
            label: "Türkçe",
            icon: "✍️",
            color: "#06b6d4",
            units: [
              { title: "Sözcük ve Cümle Bilgisi", topics: ["Sözcükte Anlam ve Yapı", "Cümlenin Ögeleri ve Anlam İlişkileri", "Cümle Yorumu"] },
              { title: "Paragraf Bilgisi", topics: ["Paragrafta Ana Düşünce ve Yardımcı Düşünceler", "Paragrafın Yapısı", "Anlatım Teknikleri"] },
              { title: "Dil Bilgisi ve Ses Bilgisi", topics: ["Ses Olayları", "Sözcük Türleri", "Yazım ve Noktalama Kuralları"] },
              { title: "Sözel Mantık", topics: ["Sözel Mantıksal Muhakeme Soruları", "Tablo ve Sıralama Problemleri"] }
            ]
          },
          {
            id: "kpss_matematik",
            label: "Matematik ve Geometri",
            icon: "🧮",
            color: "#6366f1",
            units: [
              { title: "Temel Matematik", topics: ["Sayılar ve Dört İşlem", "Bölünebilme, Asal Sayılar, EBOB-EKOK", "Rasyonel ve Ondalık Sayılar"] },
              { title: "Cebir ve Denklemler", topics: ["Üslü ve Köklü Sayılar", "Çarpanlara Ayırma", "Denklem Çözme ve Eşitsizlikler"] },
              { title: "Matematik Problemleri", topics: ["Sayı, Kesir ve Yaş Problemleri", "Yüzde, Faiz ve Kâr-Zarar Problemleri", "Karışım, İşçi ve Hız Problemleri"] },
              { title: "Sayısal Mantık", topics: ["Tablo ve Grafik Yorumlama", "Sayısal Mantıksal Muhakeme"] },
              { title: "Temel Geometri", topics: ["Üçgenler ve Çokgenler", "Çember ve Daire", "Katı Cisimler ve Analitik Geometri"] }
            ]
          }
        ]
      },
      genel_kultur: {
        label: "Genel Kültür Sınavı",
        subjects: [
          {
            id: "kpss_tarih",
            label: "Tarih",
            icon: "⚔️",
            color: "#fb923c",
            units: [
              { title: "İslamiyet Öncesi Türk Tarihi", topics: ["İlk Türk Devletleri Teşkilatı", "Kültür ve Uygarlık"] },
              { title: "Türk-İslam Tarihi", topics: ["İlk Müslüman Türk Devletleri", "Türkiye Tarihi ve Kültür Yapısı"] },
              { title: "Osmanlı Tarihi", topics: ["Osmanlı Devleti Kuruluş ve Yükselme Dönemi", "Duraklama, Gerileme ve Dağılma Dönemleri", "Osmanlı Kültür ve Medeniyeti"] },
              { title: "Milli Mücadele Dönemi", topics: ["I. Dünya Savaşı ve Sonuçları", "Kongreler ve Genelgeler", "Milli Mücadele Muharebeleri"] },
              { title: "Atatürk İlkeleri ve İnkılap Tarihi", topics: ["Atatürk İlke ve İnkılapları", "Atatürk Dönemi Türk Dış Politikası"] },
              { title: "Çağdaş Türk ve Dünya Tarihi", topics: ["II. Dünya Savaşı ve Soğuk Savaş Dönemi", "Küreselleşen Dünya"] }
            ]
          },
          {
            id: "kpss_cografya",
            label: "Coğrafya",
            icon: "🗺️",
            color: "#10b981",
            units: [
              { title: "Türkiye'nin Coğrafi Konumu", topics: ["Matematiksel ve Özel Konum", "Türkiye'nin Sınır Kapıları ve Komşuları"] },
              { title: "Türkiye'nin Fiziki Özellikleri", topics: ["Yer Şekilleri, Dağlar, Ovalar, Platolar", "Akarsular, Göller ve Toprak Tipleri", "Türkiye İklimi ve Bitki Örtüsü"] },
              { title: "Beşeri ve Ekonomik Coğrafya", topics: ["Nüfus, Göç ve Yerleşme", "Tarım, Hayvancılık ve Ormancılık", "Madenler, Enerji Kaynakları ve Sanayi", "Ulaşım, Ticaret ve Turizm"] }
            ]
          },
          {
            id: "kpss_vatandaslik",
            label: "Anayasa ve Güncel Bilgiler",
            icon: "⚖️",
            color: "#a855f7",
            units: [
              { title: "Hukukun Temel Kavramları", topics: ["Hukuk Kuralları ve Çeşitleri", "Haklar, Borçlar ve Kişiler Hukuku"] },
              { title: "Anayasal Gelişmeler and Devlet Yapısı", topics: ["Anayasa Tarihi", "Temel Hak ve Ödevler", "Yasama, Yürütme ve Yargı Organları"] },
              { title: "İdare Hukuku", topics: ["Merkezi Yönetim ve Yerinden Yönetim", "Devlet Memurluğu Kanunu (657)"] },
              { title: "Güncel Olaylar ve Genel Kültür", topics: ["Türkiye ve Dünyadaki Güncel Gelişmeler", "Uluslararası Kuruluşlar ve Zirveler"] }
            ]
          }
        ]
      }
    }
  },

  dgs: {
    title: "DGS 2027",
    subTitle: "Dikey Geçiş Sınavı",
    countdownTarget: "2027-07-04T10:00:00",
    modules: {
      sinav: {
        label: "DGS Sınav Müfredatı",
        subjects: [
          {
            id: "dgs_matematik",
            label: "Matematik ve Sayısal Mantık",
            icon: "🧮",
            color: "#6366f1",
            units: [
              { title: "Sayılar ve Cebir", topics: ["Temel Kavramlar ve Sayı Basamakları", "Bölünebilme ve Asal Sayılar", "Rasyonel-Ondalık Sayılar ve Eşitsizlikler", "Mutlak Değer, Üslü ve Köklü Sayılar"] },
              { title: "Problemler", topics: ["Sayı, Kesir ve Yaş Problemleri", "Yüzde, Kâr-Zarar ve Karışım Problemleri", "İşçi, Hız ve Hareket Problemleri"] },
              { title: "Sayısal Mantık", topics: ["Sayı Dizileri ve Örüntüler", "Şekil ve Tablo Yorumlama", "Akıl Yürütme Problemleri"] },
              { title: "Geometri", topics: ["Doğruda ve Üçgende Açılar", "Çokgenler, Çember ve Daire", "Katı Cisimler ve Analitik Geometri"] }
            ]
          },
          {
            id: "dgs_turkce",
            label: "Türkçe ve Sözel Mantık",
            icon: "📖",
            color: "#06b6d4",
            units: [
              { title: "Sözcük ve Cümle Anlamı", topics: ["Sözcükte Anlam İlişkileri", "Cümle Tamamlama ve Yorumlama"] },
              { title: "Paragraf Yapısı ve Anlam", topics: ["Paragrafın Ana Düşüncesi", "Paragraf Bölme ve Cümle Yerleştirme"] },
              { title: "Sözel Mantık", topics: ["Sıralama ve Tablo Çözümleme", "Mantıksal İlişkilendirmeler"] }
            ]
          }
        ]
      }
    }
  },

  mebags: {
    title: "MEB-AGS 2027",
    subTitle: "Milli Eğitim Bakanlığı Akademi Giriş Sınavı",
    countdownTarget: "2027-08-29T10:00:00",
    modules: {
      sinav: {
        label: "Akademi Giriş Sınav Konuları",
        subjects: [
          {
            id: "mebags_genel",
            label: "Genel Yetenek ve Genel Kültür",
            icon: "🌐",
            color: "#3b82f6",
            units: [
              { title: "Sözel ve Sayısal Yetenek", topics: ["Türkçe Dil Bilgisi ve Paragraf", "Temel Matematiksel Mantık"] },
              { title: "Genel Kültür", topics: ["Türk Kültür ve Medeniyeti", "Temel Yurttaşlık Bilgisi", "Güncel Sosyo-Ekonomik Olaylar"] }
            ]
          },
          {
            id: "mebags_mevzuat",
            label: "Eğitim Mevzuatı ve Kanunlar",
            icon: "📜",
            color: "#f59e0b",
            units: [
              { title: "Kanunlar ve Yönetmelikler", topics: ["1739 Sayılı Milli Eğitim Temel Kanunu", "657 Sayılı Devlet Memurları Kanunu", "Cumhurbaşkanlığı Teşkilatı Kararnamesinde MEB"] }
            ]
          },
          {
            id: "mebags_meslek",
            label: "Öğretmenlik Meslek Bilgisi",
            icon: "🎓",
            color: "#a855f7",
            units: [
              { title: "Eğitim Bilimleri", topics: ["Gelişim ve Öğrenme Psikolojisi", "Öğretim İlke ve Yöntemleri", "Ölçme ve Değerlendirme Esasları"] }
            ]
          }
        ]
      }
    }
  },

  ales: {
    title: "ALES 2027",
    subTitle: "Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı",
    countdownTarget: "2027-04-18T10:00:00",
    modules: {
      sinav: {
        label: "ALES Sınav Müfredatı",
        subjects: [
          {
            id: "ales_sayisal",
            label: "Sayısal Bölüm",
            icon: "🧮",
            color: "#6366f1",
            units: [
              { title: "Temel Matematik", topics: ["Sayı Kümeleri, Bölünebilme, EBOB-EKOK", "Üslü, Köklü ve Çarpanlara Ayırma", "Oran-Orantı ve Denklem Çözme"] },
              { title: "Matematiksel Problemler", topics: ["Sayı, Yaş, Kesir Problemleri", "Kâr-Zarar, Yüzde, Karışım ve İşçi Problemleri", "Hız, Grafik ve Tablo Yorumlama Problemleri"] },
              { title: "Sayısal Mantık", topics: ["Sayı Dizileri ve Özel Tanımlı Sayılar", "Şekil Yeteneği ve Akıl Yürütme"] },
              { title: "Geometri", topics: ["Açılar ve Üçgen Geometrisi", "Dörtgenler ve Çokgenler", "Çember ve Katı Cisimler"] }
            ]
          },
          {
            id: "ales_sozel",
            label: "Sözel Bölüm",
            icon: "📖",
            color: "#06b6d4",
            units: [
              { title: "Sözcük ve Cümle Anlamı", topics: ["Kelime Anlam İlişkileri", "Cümle Tamamlama ve Yakın Anlamlılık"] },
              { title: "Paragrafta Anlam ve Yapı", topics: ["Ana Düşünce ve Akışı Bozan Cümle", "Paragraf Bölme ve Cümle Yerleştirme"] },
              { title: "Sözel Mantık", topics: ["Tablo Kurma ve Sıralama Problemleri", "Önerme Eşleştirme ve Akıl Yürütme"] }
            ]
          }
        ]
      }
    }
  },

  yokdil: {
    title: "YÖKDİL 2027",
    subTitle: "Yükseköğretim Kurumları Yabancı Dil Sınavı",
    countdownTarget: "2027-03-14T10:00:00",
    modules: {
      sinav: {
        label: "YÖKDİL Alan Sınavı",
        subjects: [
          {
            id: "yokdil_ingilizce",
            label: "İngilizce Dil Becerileri",
            icon: "🇬🇧",
            color: "#3b82f6",
            units: [
              { title: "Vocabulary (Kelime Bilgisi)", topics: ["Nouns, Verbs, Adjectives, Adverbs", "Phrasal Verbs ve Collocations"] },
              { title: "Grammar (Dil Bilgisi)", topics: ["Tenses and Modals", "Active-Passive and Causatives", "Conjunctions and Prepositions", "Relative-Noun-Adverbial Clauses"] },
              { title: "Question Types (Soru Türleri)", topics: ["Sentence Completion (Cümle Tamamlama)", "Paragraph Reading (Okuduğunu Anlama)", "Translation (İngilizce-Türkçe, Türkçe-İngilizce)", "Dialogue Completion (Diyalog)", "Restatement (Yakın Anlamlı Cümle)"] }
            ]
          }
        ]
      }
    }
  },

  yds2: {
    title: "YDS/2 2027",
    subTitle: "Yabancı Dil Bilgisi Seviye Tespit Sınavı (Sonbahar)",
    countdownTarget: "2027-10-24T10:00:00",
    modules: {
      sinav: {
        label: "YDS/2 Sınav Konuları",
        subjects: [
          {
            id: "yds2_ingilizce",
            label: "İngilizce Testi",
            icon: "🌍",
            color: "#2563eb",
            units: [
              { title: "Vocabulary & Grammar", topics: ["Kelime Soruları", "Zamanlar ve Modallar", "Bağlaçlar ve Edatlar"] },
              { title: "Sentence & Paragraph Reading", topics: ["Cümle Tamamlama Soruları", "Okuma Parçaları Analizleri", "Paragraf Tamamlama"] },
              { title: "Advanced Tasks", topics: ["Diyalog Tamamlama", "Anlamca En Yakın Cümleyi Bulma", "Anlam Akışını Bozan Cümle", "İngilizce-Türkçe ve Türkçe-İngilizce Çeviriler"] }
            ]
          }
        ]
      }
    }
  },

  msu: {
    title: "MSÜ 2027",
    subTitle: "Milli Savunma Üniversitesi Sınavı",
    countdownTarget: "2027-04-04T10:00:00",
    modules: {
      sinav: {
        label: "MSÜ Sınav Müfredatı",
        subjects: [
          {
            id: "msu_turkce",
            label: "Türkçe",
            icon: "📖",
            color: "#06b6d4",
            units: [
              { title: "Sözcük ve Cümle Bilgisi", topics: ["Sözcükte Anlam ve Yapı", "Cümlede Anlam ve Yorum"] },
              { title: "Paragrafta Anlam", topics: ["Ana Düşünce ve Akış Düzenleme", "Paragraf Yapısı"] },
              { title: "Dil Bilgisi", topics: ["Ses Bilgisi", "Yazım Kuralları ve Noktalama İşaretleri", "Sözcük Türleri ve Cümlenin Ögeleri"] }
            ]
          },
          {
            id: "msu_tarih",
            label: "Tarih",
            icon: "🏛️",
            color: "#fb923c",
            units: [
              { title: "Tarih Bilimi ve İlk Devletler", topics: ["Tarih Bilimine Giriş", "İlk Türk Devletleri"] },
              { title: "Türk-İslam ve Osmanlı Tarihi", topics: ["Müslüman Türk Devletleri", "Osmanlı Devleti Kuruluş, Yükselme ve Dağılma"] },
              { title: "Milli Mücadele ve İnkılaplar", topics: ["Kurtuluş Savaşı Muharebeleri", "Atatürk İlke ve İnkılapları"] }
            ]
          },
          {
            id: "msu_cografya",
            label: "Coğrafya",
            icon: "🌍",
            color: "#10b981",
            units: [
              { title: "Fiziki Coğrafya", topics: ["Harita Bilgisi ve Koordinat Sistemi", "Dünya'nın Şekli ve Hareketleri", "Atmosfer, İklim ve Hava Olayları"] },
              { title: "Beşeri Coğrafya", topics: ["Nüfus, Göç ve Yerleşme Özellikleri", "Türkiye'nin Coğrafi Özellikleri", "Doğal Afetler ve Korunma Yolları"] }
            ]
          },
          {
            id: "msu_matematik",
            label: "Matematik ve Geometri",
            icon: "🧮",
            color: "#6366f1",
            units: [
              { title: "Temel Sayılar", topics: ["Rasyonel Sayılar, Sayı Basamakları, Bölme-Bölünebilme", "EBOB-EKOK, Üslü ve Köklü İfadeler"] },
              { title: "Denklemler ve Problemler", topics: ["Denklemler ve Eşitsizlikler", "Sayı, Yaş, Kesir Problemleri", "Hız ve İşçi Problemleri"] },
              { title: "Geometri", topics: ["Doğruda ve Üçgende Açılar", "Özel Üçgenler ve Çokgenler", "Katı Cisimler"] }
            ]
          },
          {
            id: "msu_fen",
            label: "Fen Bilimleri",
            icon: "🔬",
            color: "#ec4899",
            units: [
              { title: "Fizik Üniteleri", topics: ["Madde ve Özellikleri", "Hareket ve Kuvvet", "Elektrik ve Optik"] },
              { title: "Kimya Üniteleri", topics: ["Atomun Yapısı ve Periyodik Cetvel", "Kimyasal Türler Arası Bağlar", "Asit, Baz ve Tuz Kimyası"] },
              { title: "Biyoloji Üniteleri", topics: ["Hücre ve Yapısı", "Canlıların Temel Bileşenleri", "Hücre Bölünmeleri ve Kalıtım"] }
            ]
          }
        ]
      }
    }
  },

  yds1: {
    title: "YDS/1 2027",
    subTitle: "Yabancı Dil Bilgisi Seviye Tespit Sınavı (İlkbahar)",
    countdownTarget: "2027-04-04T10:00:00",
    modules: {
      sinav: {
        label: "YDS/1 Sınav Konuları",
        subjects: [
          {
            id: "yds1_ingilizce",
            label: "İngilizce Testi",
            icon: "🌍",
            color: "#2563eb",
            units: [
              { title: "Vocabulary & Grammar", topics: ["Kelime Soruları", "Zamanlar ve Modallar", "Bağlaçlar ve Edatlar"] },
              { title: "Sentence & Paragraph Reading", topics: ["Cümle Tamamlama Soruları", "Okuma Parçaları Analizleri", "Paragraf Tamamlama"] },
              { title: "Advanced Tasks", topics: ["Diyalog Tamamlama", "Anlamca En Yakın Cümleyi Bulma", "Anlam Akışını Bozan Cümle", "İngilizce-Türkçe ve Türkçe-İngilizce Çeviriler"] }
            ]
          }
        ]
      }
    }
  },

  yds: {
    title: "YDS 2027",
    subTitle: "Yabancı Dil Bilgisi Seviye Tespit Sınavı",
    countdownTarget: "2027-04-04T10:00:00",
    modules: {
      sinav: {
        label: "YDS Sınav Konuları",
        subjects: [
          {
            id: "yds_ingilizce",
            label: "İngilizce Testi",
            icon: "🌍",
            color: "#2563eb",
            units: [
              { title: "Vocabulary & Grammar", topics: ["Kelime Soruları", "Zamanlar ve Modallar", "Bağlaçlar ve Edatlar"] },
              { title: "Sentence & Paragraph Reading", topics: ["Cümle Tamamlama Soruları", "Okuma Parçaları Analizleri", "Paragraf Tamamlama"] },
              { title: "Advanced Tasks", topics: ["Diyalog Tamamlama", "Anlamca En Yakın Cümleyi Bulma", "Anlam Akışını Bozan Cümle", "İngilizce-Türkçe ve Türkçe-İngilizce Çeviriler"] }
            ]
          }
        ]
      }
    }
  },

  lgs: {
    title: "LGS 2027",
    subTitle: "Liselere Geçiş Sistemi Sınavı",
    countdownTarget: "2027-06-06T10:00:00",
    modules: {
      sinav: {
        label: "LGS Sınav Müfredatı",
        subjects: [
          {
            id: "lgs_turkce",
            label: "Türkçe",
            icon: "📖",
            color: "#06b6d4",
            units: [
              { title: "Anlam Bilgisi", topics: ["Sözcükte Anlam ve Cümlede Anlam", "Paragrafta Anlam ve Yapı"] },
              { title: "Dil Bilgisi", topics: ["Fiilimsiler", "Cümlenin Ögeleri", "Cümle Türleri ve Anlatım Bozuklukları"] },
              { title: "Yazım, Noktalama ve Edebi Türler", topics: ["Yazım Kuralları ve Noktalama İşaretleri", "Yazı Türleri ve Söz Sanatları"] }
            ]
          },
          {
            id: "lgs_matematik",
            label: "Matematik",
            icon: "🧮",
            color: "#6366f1",
            units: [
              { title: "Sayılar ve Cebir", topics: ["Çarpanlar ve Katlar", "Üslü İfadeler", "Kareköklü İfadeler"] },
              { title: "Veri ve Olasılık", topics: ["Veri Analizi (Grafikler)", "Basit Olayların Olma Olasılığı"] },
              { title: "Cebirsel İfadeler ve Geometri", topics: ["Cebirsel İfadeler ve Özdeşlikler", "Doğrusal Denklemler", "Eşitsizlikler, Üçgenler ve Dönüşüm Geometrisi", "Geometrik Cisimler"] }
            ]
          },
          {
            id: "lgs_fen",
            label: "Fen Bilimleri",
            icon: "🔬",
            color: "#10b981",
            units: [
              { title: "Dünya ve Yaşam", topics: ["Mevsimler ve İklim", "DNA ve Genetik Kod"] },
              { title: "Fiziksel Olaylar", topics: ["Basınç", "Basit Makineler"] },
              { title: "Madde ve Enerji", topics: ["Madde ve Endüstri", "Enerji Dönüşümleri ve Çevre Bilimi", "Elektrik Yükleri ve Elektrik Enerjisi"] }
            ]
          },
          {
            id: "lgs_inkilap",
            label: "T.C. İnkılap Tarihi ve Atatürkçülük",
            icon: "🏛️",
            color: "#fb923c",
            units: [
              { title: "Milli Uyanış ve Kongreler", topics: ["Bir Kahraman Doğuyor (Atatürk)", "Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar"] },
              { title: "Milli Mücadele ve İnkılaplar", topics: ["Milli Bir Destan: Ya İstiklal Ya Ölüm!", "Atatürkçülük ve Çağdaşlaşan Türkiye", "Demokratikleşme Çabaları ve Dış Politika"] }
            ]
          },
          {
            id: "lgs_din",
            label: "Din Kültürü ve Ahlak Bilgisi",
            icon: "☪️",
            color: "#a855f7",
            units: [
              { title: "İnanç ve İbadet", topics: ["Kader İnancı", "Zekat ve Sadaka", "Din ve Hayat", "Hz. Muhammed'in Örnekliği"] }
            ]
          },
          {
            id: "lgs_ingilizce",
            label: "Yabancı Dil (İngilizce)",
            icon: "🇬🇧",
            color: "#f43f5e",
            units: [
              { title: "Units 1-5", topics: ["Friendship", "Teen Life", "In the Kitchen", "On the Phone", "The Internet"] },
              { title: "Units 6-10", topics: ["Adventures", "Tourism", "Chores", "Science", "Natural Forces"] }
            ]
          }
        ]
      }
    }
  }
};

// YKS_DATA is kept for compatibility with existing logic if needed
const YKS_DATA = {
  tyt: EXAMS_DATA.yks.modules.tyt,
  ayt: EXAMS_DATA.yks.modules.ayt
};
