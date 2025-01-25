async function encryptData(data, publicKey) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        encodedData
    );
    return Array.from(new Uint8Array(encryptedData));
}

async function sendEncryptedData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

async function getPublicKey() {
    const response = await fetch('/getPublicKey');
    const publicKey = await response.json();
    return await window.crypto.subtle.importKey(
        'jwk',
        publicKey,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" }
        },
        true,
        ['encrypt']
    );
}

document.getElementById('signinForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // الحصول على المفتاح العام
        const publicKey = await getPublicKey();

        // تشفير البيانات (حتى لو لم يتم التحقق منها لاحقًا)
        const encryptedEmail = await encryptData(email, publicKey);
        const encryptedPassword = await encryptData(password, publicKey);

        // عرض رسالة تفيد بأن العملية تمت
        alert("تم تطبيق المفاتيح العامة والخاصة بنجاح!");

        // الانتقال دائمًا إلى الصفحة المحددة
        window.location.href = "mine_page.html";
    } catch (error) {
        console.error("Error during encryption:", error);
        alert("حدث خطأ أثناء تطبيق المفاتيح.");
    }
});
    // التحقق من صحة البيانات المشفرة
    if (decryptedEmail === "test@example.com" && decryptedPassword === "123456") {
        alert('تم تسجيل الدخول بنجاح!');
        window.location.href = "mine_page.html"; // الانتقال إلى الصفحة المطلوبة
    } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
});
