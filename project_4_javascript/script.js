const data = {
  nama: "",
  jumlah: 0,
  pilihan: [],
  pilihanTerpilih: "",
  email: ""
};

const $ = (id) => document.getElementById(id);

function tampilkanBagian(idTujuan) {
  ["bagianPilihan", "bagianPilih", "bagianEmail", "bagianHasil"].forEach(id => {
    $(id).classList.add("hidden");
  });

  if (idTujuan) {
    $(idTujuan).classList.remove("hidden");
  }
}

$("formData").addEventListener("submit", function(event) {
  event.preventDefault();

  const nama = $("nama").value.trim();
  const jumlahTeks = $("jumlah").value.trim();
  const jumlah = Number(jumlahTeks);

  $("errorNama").textContent = "";
  $("errorJumlah").textContent = "";

  let valid = true;

  if (nama.length < 2) {
    $("errorNama").textContent = "Nama wajib diisi minimal 2 karakter.";
    valid = false;
  }

  if (jumlahTeks === "" || !Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) {
    $("errorJumlah").textContent = "Masukkan bilangan bulat dari 1 sampai 20.";
    valid = false;
  }

  if (!valid) return;

  data.nama = nama;
  data.jumlah = jumlah;
  data.pilihan = [];
  $("daftarInputPilihan").replaceChildren();
  $("errorPilihan").textContent = "";

  for (let i = 0; i < data.jumlah; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.htmlFor = "pilihan" + i;
    label.textContent = "Pilihan " + (i + 1);

    const input = document.createElement("input");
    input.type = "text";
    input.id = "pilihan" + i;
    input.maxLength = 100;
    input.placeholder = "Masukkan teks pilihan " + (i + 1);
    input.required = true;

    const error = document.createElement("div");
    error.className = "error";
    error.id = "errorPilihan" + i;

    wrapper.append(label, input, error);
    $("daftarInputPilihan").appendChild(wrapper);
  }

  tampilkanBagian("bagianPilihan");
  $("bagianPilihan").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("formPilihan").addEventListener("submit", function(event) {
  event.preventDefault();

  const pilihanBaru = [];
  let valid = true;

  for (let i = 0; i < data.jumlah; i++) {
    const nilai = $("pilihan" + i).value.trim();
    $("errorPilihan" + i).textContent = "";

    if (nilai === "") {
      $("errorPilihan" + i).textContent = "Pilihan ini wajib diisi.";
      valid = false;
    }

    pilihanBaru.push(nilai);
  }

  if (!valid) {
    $("errorPilihan").textContent = "Lengkapi semua pilihan terlebih dahulu.";
    return;
  }

  data.pilihan = pilihanBaru;
  renderKontrolPilihan();
  tampilkanBagian("bagianPilih");
  $("bagianPilih").scrollIntoView({ behavior: "smooth", block: "start" });
});

function renderKontrolPilihan() {
  const area = $("kontrolPilihan");
  area.replaceChildren();
  $("errorPilih").textContent = "";

  if ($("modePilihan").value === "radio") {
    data.pilihan.forEach((teks, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "choice";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "pilihanTerpilih";
      radio.id = "radio" + index;
      radio.value = teks;

      const label = document.createElement("label");
      label.htmlFor = radio.id;
      label.textContent = teks;

      wrapper.append(radio, label);
      area.appendChild(wrapper);
    });
  } else {
    const select = document.createElement("select");
    select.id = "dropdownPilihan";
    select.setAttribute("aria-label", "Pilih salah satu opsi");

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "-- Pilih salah satu --";
    select.appendChild(placeholder);

    data.pilihan.forEach(teks => {
      const option = document.createElement("option");
      option.value = teks;
      option.textContent = teks;
      select.appendChild(option);
    });

    area.appendChild(select);
  }
}

$("modePilihan").addEventListener("change", renderKontrolPilihan);

$("formPilih").addEventListener("submit", function(event) {
  event.preventDefault();

  let terpilih = "";

  if ($("modePilihan").value === "radio") {
    const radioTerpilih = document.querySelector(
      'input[name="pilihanTerpilih"]:checked'
    );

    if (radioTerpilih) {
      terpilih = radioTerpilih.value;
    }
  } else {
    terpilih = $("dropdownPilihan").value;
  }

  if (!terpilih) {
    $("errorPilih").textContent = "Pilih salah satu opsi terlebih dahulu.";
    return;
  }

  data.pilihanTerpilih = terpilih;
  tampilkanBagian("bagianEmail");
  $("bagianEmail").scrollIntoView({ behavior: "smooth", block: "start" });
  $("email").focus();
});

$("formEmail").addEventListener("submit", function(event) {
  event.preventDefault();

  const email = $("email").value.trim();
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!polaEmail.test(email)) {
    $("errorEmail").textContent =
      "Format email tidak valid. Contoh: nama@gmail.com.";
    $("email").focus();
    return;
  }

  $("errorEmail").textContent = "";
  data.email = email;

  tampilkanHasil();
  tampilkanBagian("bagianHasil");
  $("bagianHasil").scrollIntoView({ behavior: "smooth", block: "start" });
});

function tampilkanHasil() {
  const hasil = $("hasil");
  hasil.replaceChildren();

  const kalimat = document.createElement("p");
  kalimat.textContent =
    "Hallo, nama saya " + data.nama +
    ", email nya " + data.email +
    ". Saya punya " + data.jumlah +
    " pilihann yaitu " + gabungPilihan(data.pilihan) +
    ", dan saya memilih " + data.pilihanTerpilih + ".";

  hasil.appendChild(kalimat);

  const detail = document.createElement("p");
  detail.textContent =
    "Pilihan yang tersedia: " + data.pilihan.join(", ") + ".";

  hasil.appendChild(detail);
}

function gabungPilihan(array) {
  if (array.length === 1) return array[0];
  if (array.length === 2) return array[0] + " dan " + array[1];

  return array.slice(0, -1).join(", ") +
    ", dan " + array[array.length - 1];
}

$("kembaliData").addEventListener("click", () => tampilkanBagian(null));
$("kembaliPilihan").addEventListener("click", () => tampilkanBagian("bagianPilihan"));
$("kembaliPilih").addEventListener("click", () => tampilkanBagian("bagianPilih"));

$("ulang").addEventListener("click", () => {
  data.nama = "";
  data.jumlah = 0;
  data.pilihan = [];
  data.pilihanTerpilih = "";
  data.email = "";

  $("formData").reset();
  $("formPilihan").reset();
  $("formPilih").reset();
  $("formEmail").reset();

  ["errorNama", "errorJumlah", "errorPilihan", "errorPilih", "errorEmail"]
    .forEach(id => {
      $(id).textContent = "";
    });

  $("daftarInputPilihan").replaceChildren();
  $("kontrolPilihan").replaceChildren();
  $("hasil").replaceChildren();

  tampilkanBagian(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
