import React, { useState } from 'react';
import '../RegistrationSetup.css';

interface BankAccount {
    bankCode: string;
    accountNo: string;
    accountType: string;
    bankName: string;
}

interface DirectorInfo {
    name: string;
    designation: string;
    nic: string;
    shares: string;
    contactNo: string;
    address: string;
}

interface SupportingDoc {
    code: string;
    name: string;
    selected: boolean;
    receiveDate: string;
    user: string;
}

export interface RegistrationFormData {
    applicantType: 'Individual' | 'Corporate' | '';
    title: string;
    initials: string;
    nameByInitials: string;
    surname: string;
    dateOfBirth: string;
    nic: string;
    passport: string;
    otherNo: string;
    compRegNo: string;
    telCode: string;
    telephone: string;
    faxCode: string;
    fax: string;
    mobileCode: string;
    mobile: string;
    email: string;
    tinNo: string;
    nationality: 'Foreign' | 'Local';
    relatedPartyStatus: 'None Related' | 'Related party';
    pepStatus: 'Yes' | 'No' | '';
    fatcaRegistered: 'Yes' | 'No' | '';
    correspondenceStreet: string;
    correspondenceTown: string;
    correspondenceCity: string;
    correspondenceDistrict: string;
    correspondenceCountry: string;
    correspondencePostalCode: string;
    correspondencePostalArea: string;
    permanentStreet: string;
    permanentTown: string;
    permanentCity: string;
    permanentDistrict: string;
    permanentCountry: string;
    permanentPostalCode: string;
    permanentPostalArea: string;
    addressType: 'Office' | 'Lease / Rent' | 'Owner';
    otherAddress: string;
    bank: string;
    accountType: string;
    accountNo: string;
    occupation: string;
    officeName: string;
    officeStreet: string;
    officeTown: string;
    officeCity: string;
    officePostalCode: string;
    officeCountry: string;
    officeTele: string;
    officeFaxNo: string;
    officeEmail: string;
    webRegistration: string;
    signature: string;
    married: boolean;
    spouseName: string;
    spouseOccupation: string;
    spouseEmployer: string;
    sourceOfIncome: string;
    annualIncome: string;
    incomeCurrency: string;
    riskCategory: string;
    isSubsidiaryAssociate: 'Yes' | 'No';
    ownershipType: 'Subsidiary' | 'Associate';
    organizationName: string;
    contactPersonTitle: string;
    contactPersonInitials: string;
    contactPersonFirstName: string;
    contactPersonSurname: string;
    contactPersonDesignation: string;
    contactPersonAddress: string;
    contactPersonTelephone: string;
    contactPersonFax: string;
    contactPersonEmail: string;
    heardAboutUs: string;
    promotionOther: string;
    lastFinancialYear: string;
    lastYearSales: string;
    lastYearProfit: string;
    lastYearCapital: string;
    yearBeforeLastFinancialYear: string;
    yearBeforeLastSales: string;
    yearBeforeLastProfit: string;
    yearBeforeLastCapital: string;
    isFinancialStatementsAvailable: boolean;
    statementDelivery: 'Mail' | 'E-Mail' | 'Both';
    emailNotifyEnabled: boolean;
    emailConfirmInvestment: boolean;
    emailConfirmRedemption: boolean;
    emailUnitBalance: boolean;
    emailDailyUnitPrice: boolean;
    smsNotifyEnabled: boolean;
    smsConfirmInvestment: boolean;
    smsConfirmRedemption: boolean;
    smsUnitBalance: boolean;
    smsDailyUnitPrice: boolean;
    investmentTypeAtRegistration: string;
    officeAgency: string;
    officeSubAgency: string;
    officeAgent: string;
    investorCategory: string;
    verifyingOfficer: string;
    inputOfficer: string;
    authorizedOfficer: string;
}

interface RegistrationDetailsViewProps {
    data?: Partial<RegistrationFormData>;
    bankAccounts?: BankAccount[];
    directors?: DirectorInfo[];
    supportingDocs?: SupportingDoc[];
}

const RegistrationDetailsView: React.FC<RegistrationDetailsViewProps> = ({
    data = {},
    bankAccounts = [],
    directors = [],
    supportingDocs = []
}) => {
    const [activeTab, setActiveTab] = useState('Personal Details');

    const applicationTabs = [
        'Personal Details',
        'Address/Bank Details',
        'Office/ Employee details',
        'Other Details',
        'Company other',
        'Notification',
        'Supporting Document Check List',
        'Office Use Details'
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Personal Details':
                const renderIndividualDetails = () => (
                    <div style={{ padding: '8px' }}>
                        {/* Section: Applicant Identity */}
                        <div style={{ marginBottom: '24px' }}>
                            <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '13px', color: '#1e3a8a' }}>
                                APPLICANT IDENTITY
                            </div>

                            {/* Identity Row: Radios & Header Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '20px', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '8px' }}>
                                    <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
                                        <input type="radio" checked={data.applicantType === 'Individual'} disabled style={{ width: '16px', height: '16px' }} /> INDIVIDUAL
                                    </label>
                                    <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                        <input type="radio" checked={data.applicantType === 'Corporate'} disabled style={{ width: '16px', height: '16px' }} /> CORPORATE
                                    </label>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TITLE</label>
                                        <input className="setup-input-field" value={data.title || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>INITIALS</label>
                                        <input className="setup-input-field" value={data.initials || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Row: Names */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label registration-setup-compulsory-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>NAME DENOTED BY INITIALS</label>
                                    <input className="setup-input-field" value={data.nameByInitials || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label registration-setup-compulsory-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SURNAME</label>
                                    <input className="setup-input-field" value={data.surname || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                            </div>

                            {/* Row: Date of Birth and Contact */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label registration-setup-compulsory-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>DATE OF BIRTH</label>
                                    <input type="text" className="setup-input-field" value={data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TELEPHONE</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select className="setup-input-field" disabled style={{ width: '80px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}><option>{data.telCode || '+94'}</option></select>
                                        <input className="setup-input-field" value={data.telephone || ''} disabled style={{ flex: 1, fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Row: NIC and FAX */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label registration-setup-compulsory-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>NIC</label>
                                    <input className="setup-input-field" value={data.nic || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FAX</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select className="setup-input-field" disabled style={{ width: '80px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}><option>{data.faxCode || '+94'}</option></select>
                                        <input className="setup-input-field" value={data.fax || ''} disabled style={{ flex: 1, fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Row: Passport and Mobile */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PASSPORT</label>
                                    <input className="setup-input-field" value={data.passport || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>MOBILE</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select className="setup-input-field" disabled style={{ width: '80px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}><option>{data.mobileCode || '+94'}</option></select>
                                        <input className="setup-input-field" value={data.mobile || ''} disabled style={{ flex: 1, fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Row 6: 3-column Layout for Other No, Email, TIN */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OTHER NO.</label>
                                    <input className="setup-input-field" value={data.otherNo || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>E-MAIL</label>
                                    <input className="setup-input-field" value={data.email || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TIN NO.</label>
                                    <input className="setup-input-field" value={data.tinNo || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                            </div>

                            {/* Status and Compliance */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>NATIONALITY</label>
                                    <div style={{ display: 'flex', gap: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500 }}>
                                            <input type="radio" checked={data.nationality === 'Local'} disabled style={{ width: '14px', height: '14px' }} /> LOCAL
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                            <input type="radio" checked={data.nationality === 'Foreign'} disabled style={{ width: '14px', height: '14px' }} /> FOREIGN
                                        </label>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>RELATED PARTY STATUS</label>
                                    <div style={{ display: 'flex', gap: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                            <input type="radio" checked={data.relatedPartyStatus === 'None Related'} disabled style={{ width: '14px', height: '14px' }} /> NONE RELATED
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                            <input type="radio" checked={data.relatedPartyStatus === 'Related party'} disabled style={{ width: '14px', height: '14px' }} /> RELATED PARTY
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>POLITICALLY EXPOSED PERSON (PEP)</label>
                                    <select className="setup-input-field" disabled style={{ width: '120px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}>
                                        <option>{data.pepStatus || 'Select'}</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FATCA REGISTERED</label>
                                    <select className="setup-input-field" disabled style={{ width: '120px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}>
                                        <option>{data.fatcaRegistered || 'Select'}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

                const renderCorporateDetails = () => (
                    <div style={{ padding: '8px' }}>
                        {/* Section: Applicant Identity (Corporate) */}
                        <div style={{ marginBottom: '24px' }}>
                            <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '13px', color: '#1e3a8a' }}>
                                FULL NAME OF APPLICANT
                            </div>

                            {/* Identity Row: Radios & Header Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '20px', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '8px' }}>
                                    <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                        <input type="radio" checked={data.applicantType === 'Individual'} disabled style={{ width: '16px', height: '16px' }} /> INDIVIDUAL
                                    </label>
                                    <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
                                        <input type="radio" checked={data.applicantType === 'Corporate'} disabled style={{ width: '16px', height: '16px' }} /> CORPORATE
                                    </label>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SELECT COMPANY</label>
                                    <input className="setup-input-field" value={data.nameByInitials || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                            </div>

                            {/* Row: Company and Business */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>COMPANY NAME</label>
                                    <input className="setup-input-field" value={data.nameByInitials || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>BUSINESS</label>
                                    <input className="setup-input-field" value={data.surname || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                            </div>

                            {/* Row: Commence and Contact */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label registration-setup-compulsory-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>COMMENCE</label>
                                    <input type="text" className="setup-input-field" value={data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TELEPHONE</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select className="setup-input-field" disabled style={{ width: '80px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}><option>{data.telCode || '+94'}</option></select>
                                        <input className="setup-input-field" value={data.telephone || ''} disabled style={{ flex: 1, fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Row: NIC and FAX */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label registration-setup-compulsory-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>NIC</label>
                                    <input className="setup-input-field" value={data.nic || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FAX</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select className="setup-input-field" disabled style={{ width: '80px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}><option>{data.faxCode || '+94'}</option></select>
                                        <input className="setup-input-field" value={data.fax || ''} disabled style={{ flex: 1, fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PASSPORT</label>
                                    <input className="setup-input-field" value={data.passport || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>MOBILE</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select className="setup-input-field" disabled style={{ width: '80px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}><option>{data.mobileCode || '+94'}</option></select>
                                        <input className="setup-input-field" value={data.mobile || ''} disabled style={{ flex: 1, fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Row 6: 4-column Layout for Other No, Comp Reg, Email, TIN */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OTHER NO.</label>
                                    <input className="setup-input-field" value={data.otherNo || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label registration-setup-compulsory-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>COMP REG. NO</label>
                                    <input className="setup-input-field" value={data.compRegNo || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>E-MAIL</label>
                                    <input className="setup-input-field" value={data.email || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TIN NO.</label>
                                    <input className="setup-input-field" value={data.tinNo || ''} disabled style={{ color: '#000000', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }} />
                                </div>
                            </div>

                            {/* Status and Compliance */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>NATIONALITY</label>
                                    <div style={{ display: 'flex', gap: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                            <input type="radio" checked={data.nationality === 'Local'} disabled style={{ width: '14px', height: '14px' }} /> LOCAL
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                            <input type="radio" checked={data.nationality === 'Foreign'} disabled style={{ width: '14px', height: '14px' }} /> FOREIGN
                                        </label>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>RELATED PARTY STATUS</label>
                                    <div style={{ display: 'flex', gap: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                            <input type="radio" checked={data.relatedPartyStatus === 'None Related'} disabled style={{ width: '14px', height: '14px' }} /> NONE RELATED
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                                            <input type="radio" checked={data.relatedPartyStatus === 'Related party'} disabled style={{ width: '14px', height: '14px' }} /> RELATED PARTY
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>POLITICALLY EXPOSED PERSON (PEP)</label>
                                    <select className="setup-input-field" disabled style={{ width: '120px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}>
                                        <option>{data.pepStatus || 'Select'}</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FATCA REGISTERED</label>
                                    <select className="setup-input-field" disabled style={{ width: '120px', fontSize: '13px', height: '32px', backgroundColor: '#ffffff' }}>
                                        <option>{data.fatcaRegistered || 'Select'}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

                return data.applicantType === 'Corporate' ? renderCorporateDetails() : renderIndividualDetails();
            case 'Address/Bank Details':
                return (
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            {/* Correspondence Address */}
                            <div className="setup-ash-box" style={{ padding: '16px' }}>
                                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px', fontSize: '13px', color: '#1e3a8a' }}>CORRESPONDENCE ADDRESS</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>STREET</label>
                                        <input className="setup-input-field" value={data.correspondenceStreet || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>TOWN</label>
                                            <input className="setup-input-field" value={data.correspondenceTown || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>CITY</label>
                                            <input className="setup-input-field" value={data.correspondenceCity || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>DISTRICT</label>
                                            <input className="setup-input-field" value={data.correspondenceDistrict || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>COUNTRY</label>
                                            <input className="setup-input-field" value={data.correspondenceCountry || 'Sri Lanka'} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>POSTAL CODE</label>
                                            <input className="setup-input-field" value={data.correspondencePostalCode || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>POSTAL AREA</label>
                                            <input className="setup-input-field" value={data.correspondencePostalArea || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Permanent Address */}
                            <div className="setup-ash-box" style={{ padding: '16px' }}>
                                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px', fontSize: '13px', color: '#1e3a8a' }}>PERMANENT ADDRESS</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>STREET</label>
                                        <input className="setup-input-field" value={data.permanentStreet || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>TOWN</label>
                                            <input className="setup-input-field" value={data.permanentTown || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>CITY</label>
                                            <input className="setup-input-field" value={data.permanentCity || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>DISTRICT</label>
                                            <input className="setup-input-field" value={data.permanentDistrict || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>COUNTRY</label>
                                            <input className="setup-input-field" value={data.permanentCountry || 'Sri Lanka'} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>POSTAL CODE</label>
                                            <input className="setup-input-field" value={data.permanentPostalCode || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label className="setup-input-label" style={{ fontSize: '10px', color: '#64748b' }}>POSTAL AREA</label>
                                            <input className="setup-input-field" value={data.permanentPostalArea || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="setup-ash-box" style={{ padding: '16px' }}>
                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', fontSize: '13px', color: '#1e3a8a' }}>BANK ACCOUNTS</div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                                        <tr>
                                            <th style={{ padding: '12px', textAlign: 'left', color: '#000000', fontSize: '12px', fontWeight: 600 }}>Bank Code</th>
                                            <th style={{ padding: '12px', textAlign: 'left', color: '#000000', fontSize: '12px', fontWeight: 600 }}>Account No.</th>
                                            <th style={{ padding: '12px', textAlign: 'left', color: '#000000', fontSize: '12px', fontWeight: 600 }}>Type</th>
                                            <th style={{ padding: '12px', textAlign: 'left', color: '#000000', fontSize: '12px', fontWeight: 600 }}>Bank Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bankAccounts.length > 0 ? bankAccounts.map((acc, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '10px 12px', color: '#0f172a', fontSize: '13px' }}>{acc.bankCode}</td>
                                                <td style={{ padding: '10px 12px', color: '#0f172a', fontSize: '13px' }}>{acc.accountNo}</td>
                                                <td style={{ padding: '10px 12px', color: '#0f172a', fontSize: '13px' }}>{acc.accountType}</td>
                                                <td style={{ padding: '10px 12px', color: '#0f172a', fontSize: '13px' }}>{acc.bankName}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No bank accounts recorded</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'Office/ Employee details':
                return (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                        <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '13px', color: '#1e3a8a' }}>OFFICE DETAILS</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Row 1: Name and Occupation */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE NAME</label>
                                    <input className="setup-input-field" value={data.officeName || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OCCUPATION</label>
                                    <input className="setup-input-field" value={data.occupation || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>

                            {/* Row 2: Street and Town */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE STREET</label>
                                    <input className="setup-input-field" value={data.officeStreet || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE TOWN</label>
                                    <input className="setup-input-field" value={data.officeTown || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>

                            {/* Row 3: City and Postal Code */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE CITY</label>
                                    <input className="setup-input-field" value={data.officeCity || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE POSTAL CODE</label>
                                    <input className="setup-input-field" value={data.officePostalCode || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>

                            {/* Row 4: Country and Telephone */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE COUNTRY</label>
                                    <input className="setup-input-field" value={data.officeCountry || 'Sri Lanka'} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE TELEPHONE</label>
                                    <input className="setup-input-field" value={data.officeTele || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>

                            {/* Row 5: Fax, Email and Web Registered? */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE FAX NO</label>
                                    <input className="setup-input-field" value={data.officeFaxNo || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OFFICE EMAIL</label>
                                    <input className="setup-input-field" value={data.officeEmail || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>WEB REGISTERED?</label>
                                    <input className="setup-input-field" value={data.webRegistration || 'No'} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>

                            {/* Signature Section */}
                            <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '12px', display: 'block' }}>SIGNATURE</label>
                                <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', minWidth: '300px', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {data.signature ? (
                                        <img src={data.signature} alt="Signature" style={{ maxWidth: '300px', maxHeight: '120px' }} />
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>No signature available</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Other Details':
                const renderPersonalOther = () => (
                    <div className="setup-input-section">
                        <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '16px' }}>
                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '13px', color: '#1e3a8a' }}>PERSONAL APPLICANT DETAILS</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>MARRIED</label>
                                    <div style={{ display: 'flex', gap: '16px', padding: '10px 0' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                            <input type="checkbox" checked={data.married} disabled style={{ width: '16px', height: '16px' }} /> YES
                                        </label>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SPOUSE'S NAME</label>
                                    <input className="setup-input-field" value={data.spouseName || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SPOUSE'S OCCUPATION</label>
                                    <input className="setup-input-field" value={data.spouseOccupation || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SPOUSE'S EMPLOYER</label>
                                    <input className="setup-input-field" value={data.spouseEmployer || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SOURCE OF INCOME</label>
                                    <input className="setup-input-field" value={data.sourceOfIncome || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ANNUAL INCOME</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select className="setup-input-field" disabled style={{ width: '120px', backgroundColor: '#ffffff' }}><option>{data.incomeCurrency || 'Sri Lanka'}</option></select>
                                        <input className="setup-input-field" value={data.annualIncome || ''} disabled style={{ flex: 1, backgroundColor: '#ffffff', color: '#000000' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>RISK CATEGORY</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input className="setup-input-field" value={data.riskCategory || ''} disabled style={{ flex: 1, backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                        {data.riskCategory && (
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap',
                                                background: data.riskCategory === 'Low' ? '#dcfce7' : data.riskCategory === 'Low - Medium' ? '#d1fae5' : data.riskCategory === 'Medium' ? '#fef9c3' : data.riskCategory === 'Medium - High' ? '#ffedd5' : data.riskCategory === 'High' ? '#fee2e2' : '#fce7f3',
                                                color: data.riskCategory === 'Low' ? '#15803d' : data.riskCategory === 'Low - Medium' ? '#047857' : data.riskCategory === 'Medium' ? '#a16207' : data.riskCategory === 'Medium - High' ? '#c2410c' : data.riskCategory === 'High' ? '#b91c1c' : '#9d174d',
                                            }}>{data.riskCategory}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

                const renderCorporateOther = () => (
                    <div className="setup-input-section">
                        <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '16px' }}>
                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '13px', color: '#1e3a8a' }}>CORPORATE APPLICANT DETAILS</div>

                            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SUBSIDIARY / ASSOCIATE</label>
                                        <div style={{ display: 'flex', gap: '16px', padding: '6px 0' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                                                <input type="radio" checked={data.isSubsidiaryAssociate === 'Yes'} disabled /> YES
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                                                <input type="radio" checked={data.isSubsidiaryAssociate === 'No'} disabled /> NO
                                            </label>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OWNERSHIP TYPE</label>
                                        <div style={{ display: 'flex', gap: '16px', padding: '6px 0' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                                                <input type="radio" checked={data.ownershipType === 'Subsidiary'} disabled /> SUBSIDIARY
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                                                <input type="radio" checked={data.ownershipType === 'Associate'} disabled /> ASSOCIATE
                                            </label>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ORGANIZATION NAME</label>
                                        <input className="setup-input-field" value={data.organizationName || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '12px' }}>CONTACT PERSON DETAILS</div>

                            <div style={{ display: 'grid', gridTemplateColumns: '80px 100px 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>TITLE</label>
                                    <input className="setup-input-field" value={data.contactPersonTitle || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>INITIALS</label>
                                    <input className="setup-input-field" value={data.contactPersonInitials || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>FIRST NAME</label>
                                    <input className="setup-input-field" value={data.contactPersonFirstName || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>SURNAME</label>
                                    <input className="setup-input-field" value={data.contactPersonSurname || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>DESIGNATION</label>
                                    <input className="setup-input-field" value={data.contactPersonDesignation || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>ADDRESS</label>
                                    <input className="setup-input-field" value={data.contactPersonAddress || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>TELEPHONE</label>
                                    <input className="setup-input-field" value={data.contactPersonTelephone || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>FAX</label>
                                    <input className="setup-input-field" value={data.contactPersonFax || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '10px' }}>EMAIL</label>
                                    <input className="setup-input-field" value={data.contactPersonEmail || ''} disabled style={{ backgroundColor: '#ffffff', fontSize: '12px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.applicantType === 'Corporate' ? renderCorporateOther() : renderPersonalOther()}
                        <div className="setup-ash-box" style={{ padding: '16px' }}>
                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '13px', color: '#1e3a8a' }}>HOW DID YOU HEAR ABOUT US?</div>
                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                {['Media', 'Promotion', 'Referral', 'Call Centre', 'Other'].map(option => (
                                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#000000' }}>
                                        <input type="radio" checked={data.heardAboutUs === option} disabled style={{ accentColor: '#9333ea' }} /> {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'Company other':
                return (
                    <div style={{ width: '100%' }}>
                        <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '16px' }}>
                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '13px', color: '#1e3a8a', display: 'flex', justifyContent: 'space-between' }}>
                                <span>FINANCIAL STATEMENT TURNOVER (LKR '000)</span>
                                <span style={{ color: '#64748b', fontSize: '11px' }}>Are Financial statements available? : {data.isFinancialStatementsAvailable ? 'Yes' : 'No'}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                {/* Table for Last Year */}
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                                            <th colSpan={2} style={{ padding: '10px', textAlign: 'left', fontWeight: 600 }}>As at End of Last Financial Year ({data.lastFinancialYear || 'N/A'})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '8px', color: '#64748b' }}>Annual Sales / Turnover</td>
                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500 }}>{data.lastYearSales || '0.00'}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '8px', color: '#64748b' }}>Net Profit / (Loss)</td>
                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500 }}>{data.lastYearProfit || '0.00'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px', color: '#64748b' }}>Paid up Capital</td>
                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500 }}>{data.lastYearCapital || '0.00'}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Table for Year Before Last */}
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                                            <th colSpan={2} style={{ padding: '10px', textAlign: 'left', fontWeight: 600 }}>As at End of Year Before Last ({data.yearBeforeLastFinancialYear || 'N/A'})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '8px', color: '#64748b' }}>Annual Sales / Turnover</td>
                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500 }}>{data.yearBeforeLastSales || '0.00'}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '8px', color: '#64748b' }}>Net Profit / (Loss)</td>
                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500 }}>{data.yearBeforeLastProfit || '0.00'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px', color: '#64748b' }}>Paid up Capital</td>
                                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500 }}>{data.yearBeforeLastCapital || '0.00'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="setup-ash-box" style={{ padding: '16px' }}>
                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', fontSize: '13px', color: '#1e3a8a' }}>DIRECTOR INFORMATION</div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                                        <tr>
                                            <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>NAME</th>
                                            <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>DESIGNATION</th>
                                            <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>NIC</th>
                                            <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>SHARES</th>
                                            <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>CONTACT NO</th>
                                            <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>ADDRESS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {directors.length > 0 ? directors.map((d, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '10px', fontSize: '12px' }}>{d.name}</td>
                                                <td style={{ padding: '10px', fontSize: '12px' }}>{d.designation}</td>
                                                <td style={{ padding: '10px', fontSize: '12px' }}>{d.nic}</td>
                                                <td style={{ padding: '10px', fontSize: '12px' }}>{d.shares}</td>
                                                <td style={{ padding: '10px', fontSize: '12px' }}>{d.contactNo}</td>
                                                <td style={{ padding: '10px', fontSize: '12px' }}>{d.address}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>No director information recorded</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'Notification':
                return (
                    <div style={{ width: '100%' }}>
                        <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <label className="setup-input-label" style={{ fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>STATEMENT DELIVERY preference:</label>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    {['Mail', 'E-Mail', 'Both'].map(type => (
                                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                                            <input type="radio" checked={data.statementDelivery === type} disabled /> {type.toUpperCase()}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* E-Mail Notifications */}
                            <div className="setup-ash-box" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                                    <input type="checkbox" checked={data.emailNotifyEnabled} disabled style={{ width: '16px', height: '16px' }} />
                                    <label className="setup-input-label" style={{ fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>E-MAIL NOTIFICATIONS</label>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '26px' }}>
                                    {[
                                        { label: 'CONFIRMATION OF INVESTMENT', checked: data.emailConfirmInvestment },
                                        { label: 'CONFIRMATION OF REDEMPTION', checked: data.emailConfirmRedemption },
                                        { label: 'UNIT BALANCE', checked: data.emailUnitBalance },
                                        { label: 'DAILY UNIT PRICE', checked: data.emailDailyUnitPrice }
                                    ].map((item, idx) => (
                                        <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#475569' }}>
                                            <input type="checkbox" checked={item.checked} disabled /> {item.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* SMS Notifications */}
                            <div className="setup-ash-box" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                                    <input type="checkbox" checked={data.smsNotifyEnabled} disabled style={{ width: '16px', height: '16px' }} />
                                    <label className="setup-input-label" style={{ fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>SMS NOTIFICATIONS</label>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '26px' }}>
                                    {[
                                        { label: 'CONFIRMATION OF INVESTMENT', checked: data.smsConfirmInvestment },
                                        { label: 'CONFIRMATION OF REDEMPTION', checked: data.smsConfirmRedemption },
                                        { label: 'UNIT BALANCE', checked: data.smsUnitBalance },
                                        { label: 'DAILY UNIT PRICE', checked: data.smsDailyUnitPrice }
                                    ].map((item, idx) => (
                                        <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#475569' }}>
                                            <input type="checkbox" checked={item.checked} disabled /> {item.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Supporting Document Check List':
                return (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                        <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '16px', fontSize: '13px', color: '#1e3a8a' }}>SUPPORTING DOCUMENT CHECK LIST</div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                                    <tr>
                                        <th style={{ width: '40px', padding: '10px', borderBottom: '2px solid #cbd5e1' }}></th>
                                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>CODE</th>
                                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>DOCUMENT NAME</th>
                                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>RECEIVE DATE</th>
                                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>USER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supportingDocs.map((doc, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                                <input type="checkbox" checked={doc.selected} disabled />
                                            </td>
                                            <td style={{ padding: '10px', fontSize: '12px' }}>{doc.code}</td>
                                            <td style={{ padding: '10px', fontSize: '12px' }}>{doc.name}</td>
                                            <td style={{ padding: '10px', fontSize: '12px' }}>{doc.receiveDate}</td>
                                            <td style={{ padding: '10px', fontSize: '12px' }}>{doc.user}</td>
                                        </tr>
                                    ))}
                                    {supportingDocs.length === 0 && (
                                        <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>No documents in checklist</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Office Use Details':
                return (
                    <div className="setup-input-section">
                        <div className="setup-ash-box" style={{ padding: '16px', marginBottom: '16px' }}>
                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '20px', fontSize: '13px', color: '#1e3a8a' }}>REGISTRATION OFFICE USE</div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>INVESTMENT TYPE AT REGISTRATION</label>
                                    <input className="setup-input-field" value={data.investmentTypeAtRegistration || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>INVESTOR CATEGORY</label>
                                    <input className="setup-input-field" value={data.investorCategory || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '32px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>AGENCY</label>
                                    <input className="setup-input-field" value={data.officeAgency || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SUB AGENCY</label>
                                    <input className="setup-input-field" value={data.officeSubAgency || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>AGENT</label>
                                    <input className="setup-input-field" value={data.officeAgent || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>VERIFYING OFFICER</label>
                                    <input className="setup-input-field" value={data.verifyingOfficer || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>INPUT OFFICER</label>
                                    <input className="setup-input-field" value={data.inputOfficer || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label className="setup-input-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>AUTHORIZED OFFICER</label>
                                    <input className="setup-input-field" value={data.authorizedOfficer || ''} disabled style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '13px', height: '32px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="registration-details-view" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f1f4f9' }}>
            <div className="reg-tab-bar" style={{ display: 'flex', borderBottom: '2px solid #cbd5e1', background: '#f8fafc', padding: '0 10px' }}>
                {applicationTabs.map(tab => (
                    <button
                        key={tab}
                        className={`reg-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 15px',
                            border: 'none',
                            background: activeTab === tab ? '#ffffff' : 'transparent',
                            borderBottom: activeTab === tab ? '3px solid #1e3a8a' : '3px solid transparent',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '12px',
                            color: activeTab === tab ? '#1e3a8a' : '#64748b'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="reg-modal-body" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default RegistrationDetailsView;
