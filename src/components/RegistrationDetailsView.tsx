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
    annualSalesTurnoverCurrent: string;
    annualSalesTurnoverPrevious: string;
    netProfitLossCurrent: string;
    netProfitLossPrevious: string;
    paidUpCapitalAccumulatedProfitCurrent: string;
    paidUpCapitalAccumulatedProfitPrevious: string;
    financialStatementsAvailable: 'Yes' | 'No';
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
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                        <div style={{ width: '100%', gridColumn: '1 / -1' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <div className="setup-input-label registration-setup-compulsory-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Full Name of Applicant</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                    <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <input type="radio" checked={data.applicantType === 'Individual'} disabled /> Individual
                                    </label>
                                    <label className="registration-setup-compulsory-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <input type="radio" checked={data.applicantType === 'Corporate'} disabled /> Corporate
                                    </label>
                                    {data.applicantType === 'Individual' && (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto' }}>
                                                <label className="setup-input-label" style={{ minWidth: '60px' }}>Title</label>
                                                <input className="setup-input-field" value={data.title || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto' }}>
                                                <label className="setup-input-label" style={{ minWidth: '60px' }}>Initials</label>
                                                <input className="setup-input-field" value={data.initials || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                            </div>
                                        </>
                                    )}
                                </div>
                                {data.applicantType === 'Individual' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <label className="setup-input-label" style={{ minWidth: '140px' }}>Name Denoted by Initials</label>
                                            <input className="setup-input-field" value={data.nameByInitials || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <label className="setup-input-label" style={{ minWidth: '140px' }}>Surname</label>
                                            <input className="setup-input-field" value={data.surname || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                        </div>
                                    </div>
                                )}
                                {data.applicantType === 'Corporate' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <label className="setup-input-label" style={{ minWidth: '120px' }}>Company Name</label>
                                            <input className="setup-input-field" value={data.nameByInitials || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <label className="setup-input-label" style={{ minWidth: '120px' }}>Business</label>
                                            <input className="setup-input-field" value={data.surname || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ minWidth: '100px' }}>{data.applicantType === 'Corporate' ? 'Commence' : 'DOB'}</label>
                                        <input className="setup-input-field" value={data.dateOfBirth || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ minWidth: '100px' }}>NIC</label>
                                        <input className="setup-input-field" value={data.nic || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Tele.</label>
                                        <input className="setup-input-field" value={`${data.telCode || ''} ${data.telephone || ''}`} disabled style={{ color: '#000000', flex: 1 }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ minWidth: '80px' }}>Mobile</label>
                                        <input className="setup-input-field" value={`${data.mobileCode || ''} ${data.mobile || ''}`} disabled style={{ color: '#000000', flex: 1 }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ minWidth: '100px' }}>E-mail</label>
                                        <input className="setup-input-field" value={data.email || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ minWidth: '100px' }}>Nationality</label>
                                        <input className="setup-input-field" value={data.nationality || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="setup-input-label" style={{ minWidth: '100px' }}>Risk Cat.</label>
                                        <input className="setup-input-field" value={data.riskCategory || ''} disabled style={{ color: '#000000', flex: 1 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Address/Bank Details':
                return (
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="setup-ash-box" style={{ padding: '16px' }}>
                                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Correspondence Address</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input className="setup-input-field" value={data.correspondenceStreet || ''} disabled placeholder="Street" />
                                    <input className="setup-input-field" value={data.correspondenceTown || ''} disabled placeholder="Town" />
                                    <input className="setup-input-field" value={data.correspondenceCity || ''} disabled placeholder="City" />
                                    <input className="setup-input-field" value={data.correspondenceDistrict || ''} disabled placeholder="District" />
                                </div>
                            </div>
                            <div className="setup-ash-box" style={{ padding: '16px' }}>
                                <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Permanent Address</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input className="setup-input-field" value={data.permanentStreet || ''} disabled placeholder="Street" />
                                    <input className="setup-input-field" value={data.permanentTown || ''} disabled placeholder="Town" />
                                    <input className="setup-input-field" value={data.permanentCity || ''} disabled placeholder="City" />
                                    <input className="setup-input-field" value={data.permanentDistrict || ''} disabled placeholder="District" />
                                </div>
                            </div>
                        </div>
                        <div className="setup-ash-box" style={{ padding: '16px' }}>
                            <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Bank Accounts</div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                                <thead style={{ backgroundColor: '#f1f5f9' }}>
                                    <tr>
                                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Bank Code</th>
                                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Account No.</th>
                                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Type</th>
                                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Bank Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bankAccounts.length > 0 ? bankAccounts.map((acc, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{acc.bankCode}</td>
                                            <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{acc.accountNo}</td>
                                            <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{acc.accountType}</td>
                                            <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{acc.bankName}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} style={{ padding: '8px', textAlign: 'center' }}>No bank accounts</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Office/ Employee details':
                return (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                        <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Office Details</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="setup-input-label" style={{ minWidth: '100px' }}>Office Name</label>
                                <input className="setup-input-field" value={data.officeName || ''} disabled style={{ flex: 1 }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="setup-input-label" style={{ minWidth: '100px' }}>Occupation</label>
                                <input className="setup-input-field" value={data.occupation || ''} disabled style={{ flex: 1 }} />
                            </div>
                        </div>
                        {data.signature && (
                            <div style={{ marginTop: '16px' }}>
                                <div className="setup-input-label" style={{ marginBottom: '8px' }}>Signature</div>
                                <img src={data.signature} alt="Signature" style={{ border: '1px solid #cbd5e1', borderRadius: '4px', maxWidth: '300px' }} />
                            </div>
                        )}
                    </div>
                );
            case 'Other Details':
                return (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="setup-input-label" style={{ minWidth: '120px' }}>Income Source</label>
                                <input className="setup-input-field" value={data.sourceOfIncome || ''} disabled style={{ flex: 1 }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="setup-input-label" style={{ minWidth: '120px' }}>Annual Income</label>
                                <input className="setup-input-field" value={`${data.incomeCurrency || ''} ${data.annualIncome || ''}`} disabled style={{ flex: 1 }} />
                            </div>
                        </div>
                    </div>
                );
            case 'Company other':
                return (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                        <div className="setup-input-label" style={{ fontWeight: 600, marginBottom: '12px' }}>Director Information</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                            <thead style={{ backgroundColor: '#f1f5f9' }}>
                                <tr>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Name</th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Designation</th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>NIC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {directors.length > 0 ? directors.map((d, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{d.name}</td>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{d.designation}</td>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{d.nic}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} style={{ padding: '8px', textAlign: 'center' }}>No director information</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            case 'Notification':
                return (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <label className="setup-input-label" style={{ fontWeight: 600 }}>Statement Delivery:</label> {data.statementDelivery}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px' }}>
                                    <input type="checkbox" checked={data.emailNotifyEnabled} disabled /> E-Mail Notifications
                                </label>
                                <div style={{ marginLeft: '24px', fontSize: '12px' }}>
                                    <div>Investment: {data.emailConfirmInvestment ? 'Yes' : 'No'}</div>
                                    <div>Redemption: {data.emailConfirmRedemption ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px' }}>
                                    <input type="checkbox" checked={data.smsNotifyEnabled} disabled /> SMS Notifications
                                </label>
                                <div style={{ marginLeft: '24px', fontSize: '12px' }}>
                                    <div>Investment: {data.smsConfirmInvestment ? 'Yes' : 'No'}</div>
                                    <div>Redemption: {data.smsConfirmRedemption ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Supporting Document Check List':
                return (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                            <thead style={{ backgroundColor: '#f1f5f9' }}>
                                <tr>
                                    <th style={{ width: '40px', border: '1px solid #cbd5e1' }}></th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Document</th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supportingDocs.map((doc, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center', border: '1px solid #cbd5e1' }}><input type="checkbox" checked={doc.selected} disabled /></td>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{doc.name}</td>
                                        <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{doc.receiveDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'Office Use Details':
                return (
                    <div className="setup-ash-box" style={{ padding: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="setup-input-label" style={{ minWidth: '120px' }}>Input Officer</label>
                                <input className="setup-input-field" value={data.inputOfficer || ''} disabled style={{ flex: 1 }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="setup-input-label" style={{ minWidth: '120px' }}>Auth Officer</label>
                                <input className="setup-input-field" value={data.authorizedOfficer || ''} disabled style={{ flex: 1 }} />
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
