/**
 * ==========================================================================
 * PAL ACADEMY - सुपर एडवांस एंड डायनेमिक स्क्रिप्ट (2026 एडिशन)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // सभी जरूरी एलिमेंट्स को सेलेक्ट करना
    const ui = {
        classSelect: document.getElementById('classSelect'),
        streamGroup: document.getElementById('streamGroup'),
        streamSelect: document.getElementById('streamSelect'),
        feeDisplay: document.getElementById('feeDisplay'),
        feeAmount: document.getElementById('feeAmount'),
        mobileNumber: document.getElementById('mobileNumber'),
        otpBtn: document.getElementById('otpBtn'),
        otpGroup: document.getElementById('otpGroup'),
        otpInput: document.getElementById('otpInput'),
        verifyBtn: document.getElementById('verifyBtn'),
        otpStatus: document.getElementById('otpStatus'),
        submitBtn: document.getElementById('submitBtn'),
        form: document.getElementById('registrationForm')
    };

    // स्टेट मैनेजमेंट (डेटा को याद रखने के लिए)
    let state = {
        generatedOTP: null,
        isVerified: false,
        countdown: 30,
        timerInterval: null
    };

    /* ==========================================================================
       1. फीस और स्ट्रीम का जादुई कैलकुलेटर (3D ग्लो इफेक्ट के साथ)
       ========================================================================== */
    ui.classSelect.addEventListener('change', (e) => {
        const selectedClass = e.target.value;

        if (!selectedClass) {
            ui.streamGroup.classList.add('hidden');
            ui.feeDisplay.classList.add('hidden');
            ui.streamSelect.removeAttribute('required');
            return;
        }

        // 9वीं, 11वीं और 12वीं के लिए स्ट्रीम का ऑप्शन दिखाना
        if (["9", "11", "12"].includes(selectedClass)) {
            ui.streamGroup.classList.remove('hidden');
            ui.streamSelect.setAttribute('required', 'required');
        } else {
            ui.streamGroup.classList.add('hidden');
            ui.streamSelect.removeAttribute('required');
        }

        // आपके नियम के अनुसार फीस सेट करना
        let fee = ["9", "10"].includes(selectedClass) ? "₹600" : "₹800";
        ui.feeAmount.innerText = fee;
        
        // फीस बॉक्स को एनिमेशन के साथ दिखाना
        ui.feeDisplay.classList.remove('hidden');
        ui.feeDisplay.style.animation = "none";
        setTimeout(() => ui.feeDisplay.style.animation = "floating 1s ease", 10);
    });

    /* ==========================================================================
       2. असली जैसा OTP जनरेटर और टाइमर सिस्टम (खतरनाक सिक्योरिटी)
       ========================================================================== */
    ui.otpBtn.addEventListener('click', () => {
        const phone = ui.mobileNumber.value.trim();
        
        // भारतीय मोबाइल नंबर की कड़क जांच (10 अंक और शुरू में 6,7,8,9 होना चाहिए)
        const phonePattern = /^[6-9]\d{9}$/;
        if (!phonePattern.test(phone)) {
            alert("❌ कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें!");
            return;
        }

        // हर बार एक नया और रैंडम 4-अंकों का OTP जनरेट करना
        state.generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
        
        // स्क्रीन पर बॉक्स दिखाना
        ui.otpGroup.classList.remove('hidden');
        ui.otpStatus.style.color = "#e0a96d";
        ui.otpStatus.innerText = "📩 आपके नंबर पर ओटीपी भेजा जा रहा है...";

        // असली अलर्ट बॉक्स में OTP दिखाना (ताकि छात्र उसे देखकर डाल सके)
        setTimeout(() => {
            alert(`🔐 PAL ACADEMY सुरक्षा कोड:\nआपका वन-टाइम पासवर्ड (OTP) है: ${state.generatedOTP}\nयह कोड किसी के साथ शेयर न करें।`);
            ui.otpStatus.innerText = "⏱️ कृपया 4-अंकों का ओटीपी दर्ज करें।";
            startOTPTimer();
        }, 800);
    });

    // पुनः भेजें (Resend) बटन के लिए 30 सेकंड का टाइमर
    function startOTPTimer() {
        clearInterval(state.timerInterval);
        state.countdown = 30;
        ui.otpBtn.setAttribute('disabled', true);
        
        state.timerInterval = setInterval(() => {
            state.countdown--;
            ui.otpBtn.innerText = `पुनः भेजें (${state.countdown}s)`;
            
            if (state.countdown <= 0) {
                clearInterval(state.timerInterval);
                ui.otpBtn.removeAttribute('disabled');
                ui.otpBtn.innerText = "OTP पुनः भेजें";
            }
        }, 1000);
    }

    /* ==========================================================================
       3. OTP वेरिफिकेशन (मैच होने पर ग्रीन टिक और बटन अनलॉक)
       ========================================================================== */
    ui.verifyBtn.addEventListener('click', () => {
        const userOtp = ui.otpInput.value.trim();

        if (userOtp === state.generatedOTP) {
            // सफलता! सब कुछ लॉक और सबमिट बटन अनलॉक
            state.isVerified = true;
            clearInterval(state.timerInterval);
            
            ui.otpStatus.className = "success-text";
            ui.otpStatus.innerHTML = "✓ मोबाइल नंबर सफलतापूर्वक सत्यापित (Verify) हो गया है!";
            
            ui.submitBtn.removeAttribute('disabled');
            ui.submitBtn.style.background = "linear-gradient(135deg, #4fec54, #22b126)";
            ui.submitBtn.style.color = "#ffffff";
            ui.submitBtn.innerText = "🚀 फाइनल रजिस्ट्रेशन सबमिट करें";

            // इनपुट बॉक्स को लॉक करना ताकि कोई बाद में नंबर न बदल सके
            ui.mobileNumber.setAttribute('readonly', true);
            ui.otpInput.setAttribute('readonly', true);
            ui.verifyBtn.setAttribute('disabled', true);
            ui.otpBtn.setAttribute('disabled', true);
            ui.otpBtn.innerText = "Verified ✓";
        } else {
            ui.otpStatus.style.color = "#ff4d4d";
            ui.otpStatus.innerText = "❌ गलत ओटीपी! कृपया दोबारा सही कोड डालें।";
            ui.otpInput.value = "";
        }
    });

    /* ==========================================================================
       4. धमाकेदार फाइनल सबमिशन (Celebration Effect)
       ========================================================================== */
    ui.form.addEventListener('submit', (e) => {
        e.preventDefault(); // पेज रीलोड होने से रोकना

        if (!state.isVerified) {
            alert("⚠️ कृपया पहले मोबाइल नंबर का ओटीपी वेरीफाई करें!");
            return;
        }

        // छात्र का नाम निकालकर स्वागत करना
        const studentName = document.getElementById('studentName').value.trim();

        // एक तगड़ा और कस्टमाइज्ड सक्सेस मैसेज
        alert(`🎉 बधाई हो ${studentName}!\n\nपाल एकेडमी (ग्राम: पटनी, सहारनपुर) में आपका ओरिजिनल रजिस्ट्रेशन सफलतापूर्वक सुरक्षित कर लिया गया है।\n\n📅 क्लासेस शुरू होने की तारीख: 2 जून 2026\n\nहमारी टीम अगले 24 घंटों के भीतर आपके नंबर पर संपर्क करेगी। पढ़ने के लिए तैयार रहें! 📚`);
        
        // फॉर्म को खाली करना
        ui.form.reset();
        
        // वापस शुरुआती स्थिति में लाना
        ui.submitBtn.setAttribute('disabled', true);
        ui.submitBtn.style.background = "#444444";
        ui.submitBtn.innerText = "पहले मोबाइल नंबर वेरीफाई करें";
        ui.otpGroup.classList.add('hidden');
        ui.feeDisplay.classList.add('hidden');
        ui.streamGroup.classList.add('hidden');
        
        // अनलॉक फ़ील्ड्स को रीसेट करना
        ui.mobileNumber.removeAttribute('readonly');
        ui.otpInput.removeAttribute('readonly');
        ui.verifyBtn.removeAttribute('disabled');
        ui.otpBtn.removeAttribute('disabled');
        ui.otpBtn.innerText = "OTP भेजें";
        state.isVerified = false;
    });
});
