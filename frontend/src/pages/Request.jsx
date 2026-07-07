import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  Landmark,
  Banknote,
  CheckCircle,
  Copy,
  Mail,
  Phone,
  User,
  Briefcase,
  Receipt,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Request.css';

const mockProviders = {
  p1:  { id: 'p1',  name: 'Nuwan Perera',        service: 'Electrical',    price: 'Rs. 1,500 / visit', mobile: '+94 71 234 5678', email: 'nuwan.perera@example.com' },
  p2:  { id: 'p2',  name: 'Sahan Fernando',      service: 'Plumbing',      price: 'Rs. 1,200 / visit', mobile: '+94 72 345 6789', email: 'sahan.fernando@example.com' },
  p3:  { id: 'p3',  name: 'Dilani Silva',        service: 'Cleaning',      price: 'Rs. 4,500 / visit', mobile: '+94 76 456 7890', email: 'dilani.silva@example.com' },
  p4:  { id: 'p4',  name: 'Roshan Jayasuriya',  service: 'AC repair',     price: 'Rs. 3,500 / visit', mobile: '+94 77 567 8901', email: 'roshan.j@example.com' },
  p5:  { id: 'p5',  name: 'Kasun Bandara',      service: 'Painting',      price: 'Rs. 2,500 / visit', mobile: '+94 78 678 9012', email: 'kasun.bandara@example.com' },
  p6:  { id: 'p6',  name: 'Priyantha Kumara',   service: 'Carpentry',     price: 'Rs. 3,000 / visit', mobile: '+94 71 789 0123', email: 'priyantha.k@example.com' },
  p7:  { id: 'p7',  name: 'Chamara Rathnayake', service: 'Masonry',       price: 'Rs. 2,000 / visit', mobile: '+94 72 890 1234', email: 'chamara.r@example.com' },
  p8:  { id: 'p8',  name: 'Anushka Wijesinghe', service: 'General repair', price: 'Rs. 1,000 / visit', mobile: '+94 76 901 2345', email: 'anushka.w@example.com' },
  p9:  { id: 'p9',  name: 'Lasith Gunawardena', service: 'Electrical',    price: 'Rs. 1,800 / visit', mobile: '+94 77 012 3456', email: 'lasith.g@example.com' },
  p10: { id: 'p10', name: 'Tharindu Mendis',    service: 'Plumbing',      price: 'Rs. 1,400 / visit', mobile: '+94 78 123 4567', email: 'tharindu.m@example.com' },
};

const STEPS = ['Request details', 'Payment', 'Confirmation'];

const SERVICE_FEE = 150;

function generateBookingId() {
  return 'WRK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateBankRef() {
  return 'BT-' + Date.now().toString().slice(-8);
}

export default function Request() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const provider = mockProviders[providerId] || mockProviders['p1'];

  const basePrice = parseInt(provider.price.replace(/[^0-9]/g, ''));

  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bookingId] = useState(generateBookingId());
  const [bankRef] = useState(generateBankRef());

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '',
    notes: '',
  });

  const [payMethod, setPayMethod] = useState('');

  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    bankName: '',
    branch: '',
    amount: basePrice + SERVICE_FEE,
    transferRef: '',
  });

  const totalAmount = basePrice + SERVICE_FEE;

  const handleFormChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleBankChange = (field, value) =>
    setBankDetails((prev) => ({ ...prev, [field]: value }));

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canProceedStep0 =
    form.name && form.phone && form.email && form.address && form.date && form.time;

  const canProceedStep1 = payMethod !== '';

  const canProceedBankTransfer =
    payMethod === 'bank' &&
    bankDetails.accountName &&
    bankDetails.bankName &&
    bankDetails.branch &&
    bankDetails.transferRef;

  const canProceedCash = payMethod === 'cash';

  const canFinish = payMethod === 'bank' ? canProceedBankTransfer : canProceedCash;

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div className="request-page">
      <Navbar />

      <section className="request-header">
        <span className="request-eyebrow">Book a service</span>
        <h1>Request {provider.name}</h1>
        <p>{provider.service} · {provider.price}</p>
      </section>

      <div className="request-layout">
        {/* Stepper */}
        <div className="request-stepper">
          {STEPS.map((label, i) => (
            <div key={label} className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span>{label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="request-content">

          {/* ===== STEP 0: REQUEST DETAILS ===== */}
          {step === 0 && (
            <div className="request-card">
              <h2>
                <FileText size={18} aria-hidden="true" />
                Your details
              </h2>

              <div className="request-fields-grid">
                <div className="request-field">
                  <label>Full name</label>
                  <div className="request-input-icon">
                    <User size={15} aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                    />
                  </div>
                </div>

                <div className="request-field">
                  <label>Phone number</label>
                  <div className="request-input-icon">
                    <Phone size={15} aria-hidden="true" />
                    <input
                      type="tel"
                      placeholder="+94 7X XXX XXXX"
                      value={form.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="request-field">
                  <label>Email address</label>
                  <div className="request-input-icon">
                    <Mail size={15} aria-hidden="true" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="request-field">
                  <label>Service address</label>
                  <div className="request-input-icon">
                    <MapPin size={15} aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Where do you need the service?"
                      value={form.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                    />
                  </div>
                </div>

                <div className="request-field">
                  <label>Preferred date</label>
                  <div className="request-input-icon">
                    <Calendar size={15} aria-hidden="true" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="request-field">
                  <label>Preferred time</label>
                  <div className="request-input-icon">
                    <Clock size={15} aria-hidden="true" />
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => handleFormChange('time', e.target.value)}
                    />
                  </div>
                </div>

                <div className="request-field full-width">
                  <label>Additional notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the issue or any special instructions..."
                    value={form.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                  />
                </div>
              </div>

              <div className="request-nav">
                <span />
                <button
                  className="request-btn request-btn-primary"
                  onClick={handleNext}
                  disabled={!canProceedStep0}
                >
                  Continue to payment
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 1: PAYMENT ===== */}
          {step === 1 && (
            <div className="request-card">
              <h2>
                <CreditCard size={18} aria-hidden="true" />
                Choose payment method
              </h2>

              <div className="pay-methods">
                <button
                  className={`pay-method-card ${payMethod === 'bank' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('bank')}
                >
                  <div className="pay-method-icon">
                    <Landmark size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3>Bank transfer</h3>
                    <p>Transfer to our account and enter your reference code</p>
                  </div>
                  <div className="pay-method-check">
                    {payMethod === 'bank' && <Check size={14} />}
                  </div>
                </button>

                <button
                  className={`pay-method-card ${payMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('cash')}
                >
                  <div className="pay-method-icon">
                    <Banknote size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3>Cash on service</h3>
                    <p>Pay the provider directly in cash when they arrive</p>
                  </div>
                  <div className="pay-method-check">
                    {payMethod === 'cash' && <Check size={14} />}
                  </div>
                </button>
              </div>

              {/* Bank transfer details form */}
              {payMethod === 'bank' && (
                <div className="bank-section">
                  <div className="bank-info-box">
                    <h4>Transfer to this account</h4>
                    <div className="bank-info-row">
                      <span>Bank</span>
                      <strong>Bank of Ceylon</strong>
                    </div>
                    <div className="bank-info-row">
                      <span>Account name</span>
                      <strong>Workly (Pvt) Ltd</strong>
                    </div>
                    <div className="bank-info-row">
                      <span>Account number</span>
                      <div className="bank-copy-row">
                        <strong>1234-5678-9012</strong>
                        <button
                          className="bank-copy-btn"
                          onClick={() => handleCopy('1234567890120')}
                          aria-label="Copy account number"
                        >
                          {copied ? <Check size={13} /> : <Copy size={13} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="bank-info-row">
                      <span>Amount to transfer</span>
                      <strong className="bank-amount">Rs. {totalAmount.toLocaleString()}</strong>
                    </div>
                    <div className="bank-info-row">
                      <span>Your reference code</span>
                      <div className="bank-copy-row">
                        <strong>{bankRef}</strong>
                        <button
                          className="bank-copy-btn"
                          onClick={() => handleCopy(bankRef)}
                          aria-label="Copy reference"
                        >
                          {copied ? <Check size={13} /> : <Copy size={13} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <p className="bank-note">
                      Use your reference code as the transfer description so we can match your payment.
                    </p>
                  </div>

                  <h4 className="bank-confirm-title">Confirm your transfer</h4>
                  <div className="request-fields-grid">
                    <div className="request-field">
                      <label>Your bank account name</label>
                      <input
                        type="text"
                        placeholder="Name on your bank account"
                        value={bankDetails.accountName}
                        onChange={(e) => handleBankChange('accountName', e.target.value)}
                      />
                    </div>
                    <div className="request-field">
                      <label>Your bank name</label>
                      <input
                        type="text"
                        placeholder="e.g. Commercial Bank"
                        value={bankDetails.bankName}
                        onChange={(e) => handleBankChange('bankName', e.target.value)}
                      />
                    </div>
                    <div className="request-field">
                      <label>Branch</label>
                      <input
                        type="text"
                        placeholder="e.g. Colombo 03"
                        value={bankDetails.branch}
                        onChange={(e) => handleBankChange('branch', e.target.value)}
                      />
                    </div>
                    <div className="request-field">
                      <label>Your transfer reference / receipt number</label>
                      <input
                        type="text"
                        placeholder="Enter the reference from your bank slip"
                        value={bankDetails.transferRef}
                        onChange={(e) => handleBankChange('transferRef', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {payMethod === 'cash' && (
                <div className="cash-note">
                  <CheckCircle size={18} aria-hidden="true" />
                  <p>
                    You'll pay <strong>Rs. {basePrice.toLocaleString()}</strong> directly to the provider in cash
                    when they arrive. The service fee of <strong>Rs. {SERVICE_FEE}</strong> is waived for cash payments.
                  </p>
                </div>
              )}

              <div className="request-nav">
                <button className="request-btn request-btn-ghost" onClick={handleBack}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  className="request-btn request-btn-primary"
                  onClick={handleNext}
                  disabled={!canFinish}
                >
                  Confirm booking
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2: CONFIRMATION / BILL ===== */}
          {step === 2 && (
            <div className="request-card confirmation-card">
              <div className="confirm-success">
                <div className="confirm-success-icon">
                  <CheckCircle size={40} />
                </div>
                <h2>Booking confirmed!</h2>
                <p>Your request has been sent to {provider.name}. You'll receive a confirmation email shortly.</p>
              </div>

              {/* Bill */}
              <div className="bill">
                <div className="bill-header">
                  <div>
                    <div className="bill-logo">W</div>
                    <span>Workly</span>
                  </div>
                  <div className="bill-id">
                    <span>Booking ID</span>
                    <strong>{bookingId}</strong>
                  </div>
                </div>

                <div className="bill-divider" />

                <div className="bill-section-title">Service details</div>
                <div className="bill-row">
                  <span><User size={13} /> Provider</span>
                  <strong>{provider.name}</strong>
                </div>
                <div className="bill-row">
                  <span><Briefcase size={13} /> Service</span>
                  <strong>{provider.service}</strong>
                </div>
                <div className="bill-row">
                  <span><Calendar size={13} /> Date</span>
                  <strong>{form.date}</strong>
                </div>
                <div className="bill-row">
                  <span><Clock size={13} /> Time</span>
                  <strong>{form.time}</strong>
                </div>
                <div className="bill-row">
                  <span><MapPin size={13} /> Address</span>
                  <strong>{form.address}</strong>
                </div>

                <div className="bill-divider" />

                <div className="bill-section-title">Customer details</div>
                <div className="bill-row">
                  <span><User size={13} /> Name</span>
                  <strong>{form.name}</strong>
                </div>
                <div className="bill-row">
                  <span><Phone size={13} /> Phone</span>
                  <strong>{form.phone}</strong>
                </div>
                <div className="bill-row">
                  <span><Mail size={13} /> Email</span>
                  <strong>{form.email}</strong>
                </div>

                <div className="bill-divider" />

                <div className="bill-section-title">Payment summary</div>
                <div className="bill-row">
                  <span>Service charge</span>
                  <span>Rs. {basePrice.toLocaleString()}</span>
                </div>
                {payMethod === 'bank' && (
                  <div className="bill-row">
                    <span>Platform fee</span>
                    <span>Rs. {SERVICE_FEE}</span>
                  </div>
                )}
                <div className="bill-row bill-total">
                  <span>Total paid</span>
                  <strong>Rs. {payMethod === 'cash' ? basePrice.toLocaleString() : totalAmount.toLocaleString()}</strong>
                </div>
                <div className="bill-row">
                  <span>Payment method</span>
                  <span className="bill-pay-badge">
                    {payMethod === 'bank' ? <><Landmark size={12} /> Bank transfer</> : <><Banknote size={12} /> Cash on service</>}
                  </span>
                </div>
                {payMethod === 'bank' && (
                  <div className="bill-row">
                    <span>Transfer reference</span>
                    <strong>{bankDetails.transferRef}</strong>
                  </div>
                )}

                <div className="bill-divider" />

                <div className="bill-footer">
                  <p>A copy of this receipt has been sent to <strong>{form.email}</strong></p>
                  <p>Questions? Contact us at xenoralabs@gmail.com or +94 78 462 7089</p>
                </div>
              </div>

              <div className="confirm-actions">
                <button
                  className="request-btn request-btn-ghost"
                  onClick={() => window.print()}
                >
                  <Receipt size={16} /> Print / Save as PDF
                </button>
                <Link to="/" className="request-btn request-btn-primary">
                  Back to home
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        {step < 2 && (
          <div className="request-summary">
            <div className="summary-card">
              <h3>Order summary</h3>
              <div className="summary-provider">
                <div className="summary-avatar">
                  {provider.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <strong>{provider.name}</strong>
                  <span>{provider.service}</span>
                </div>
              </div>
              <div className="summary-divider" />
              <div className="summary-row">
                <span>Service charge</span>
                <span>Rs. {basePrice.toLocaleString()}</span>
              </div>
              {payMethod === 'bank' && (
                <div className="summary-row">
                  <span>Platform fee</span>
                  <span>Rs. {SERVICE_FEE}</span>
                </div>
              )}
              <div className="summary-row summary-total">
                <span>Total</span>
                <strong>
                  Rs. {payMethod === 'cash' ? basePrice.toLocaleString() : totalAmount.toLocaleString()}
                </strong>
              </div>
              {form.date && (
                <div className="summary-date">
                  <Calendar size={13} /> {form.date} {form.time && `at ${form.time}`}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}