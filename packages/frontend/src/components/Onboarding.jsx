import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Popup from "reactjs-popup";

import "./onboarding.css";

export function Onboarding() {
  return (
    <Popup
      modal
      //   trigger={<button className="onboarding-popup">Help me</button>}
      open={true}
    >
      <header className="popup-header">
        <h2>👋 Hi, Let’s Get Started!</h2>
      </header>

      <form
        onSubmit={() => {
          //chnage url to /guide
          console.log("Submitted");

          window.location.href = "/guide";
        }}
      >
        <label htmlFor="orgname">Name</label>
        <input type="text" placeholder="Uber" id="orgname" />

        <div className="divider" />

        <label htmlFor="structure">
          What is the most tax-efficient legal structure for your business?
        </label>

        <select id="structure">
          <option value="LLC">LLC</option>
          <option value="S-Corp">S-Corp</option>
          <option value="C-Corp">C-Corp</option>
          <option value="Sole Proprietorship">Sole Proprietorship</option>
        </select>

        <label htmlFor="dtas">
          Do you currently leverage double taxation agreements (DTAs) to reduce
          withholding taxes on dividends, interest, and royalties?
        </label>
        <select id="dtas">
          <option value="Yes">
            Yes, we actively use DTAs to minimize withholding taxes
          </option>
          <option value="No">No</option>
        </select>

        <label htmlFor="timing">
          Do you manage the timing of income and expenses to optimize your tax
          situation?
        </label>
        <select id="timing">
          <option value="Yes">
            Yes, we plan the timing of income and expenses strategically
          </option>
          <option value="No">No</option>
        </select>

        {/* New Question 1: International Operations */}
        <label htmlFor="international-operations">
          Do you have significant international business operations?
        </label>
        <select id="international-operations">
          <option value="Yes">Yes, we operate in multiple countries</option>
          <option value="No">No, we are primarily domestic</option>
        </select>

        {/* New Question 2: R&D Tax Credits */}
        <label htmlFor="rd-credits">
          Have you explored R&D tax credits or innovation incentives?
        </label>
        <select id="rd-credits">
          <option value="Yes">Yes, we actively claim R&D tax credits</option>
          <option value="No">No, but we're interested</option>
          <option value="NotApplicable">Not applicable to our business</option>
        </select>

        {/* New Question 3: Employee Compensation Strategy */}
        <label htmlFor="compensation-strategy">
          What is your primary employee compensation strategy?
        </label>
        <select id="compensation-strategy">
          <option value="Salary">Fixed Salary</option>
          <option value="SalaryBonus">Salary with Performance Bonuses</option>
          <option value="Equity">Equity-Heavy Compensation</option>
          <option value="Mixed">Mixed Compensation Approach</option>
        </select>

        {/* New Question 4: Depreciation Method */}
        <label htmlFor="depreciation">
          What depreciation method do you primarily use for tax purposes?
        </label>
        <select id="depreciation">
          <option value="Straight">Straight-Line Depreciation</option>
          <option value="Accelerated">Accelerated Depreciation</option>
          <option value="Section179">Section 179 Deduction</option>
          <option value="Other">Other Method</option>
        </select>

        {/* New Question 5: Capital Investment */}
        <label htmlFor="capital-investment">
          Estimated annual capital investment for business assets?
        </label>
        <select id="capital-investment">
          <option value="Low">Less than $50,000</option>
          <option value="Medium">$50,000 - $250,000</option>
          <option value="High">$250,000 - $1,000,000</option>
          <option value="VeryHigh">Over $1,000,000</option>
        </select>

        {/* New Question 6: Accounting Method */}
        <label htmlFor="accounting-method">
          What accounting method do you primarily use?
        </label>
        <select id="accounting-method">
          <option value="Cash">Cash Basis</option>
          <option value="Accrual">Accrual Basis</option>
          <option value="Hybrid">Hybrid Method</option>
        </select>

        {/* New Question 7: Business Insurance */}
        <label htmlFor="business-insurance">
          Do you have comprehensive business insurance coverage?
        </label>
        <select id="business-insurance">
          <option value="Comprehensive">
            Comprehensive coverage across all business risks
          </option>
          <option value="Limited">Limited coverage</option>
          <option value="No">No specific business insurance</option>
        </select>

        {/* New Question 8: Retirement Plans */}
        <label htmlFor="retirement-plans">
          What type of retirement plans do you offer employees?
        </label>
        <select id="retirement-plans">
          <option value="401k">Traditional 401(k)</option>
          <option value="Roth401k">Roth 401(k)</option>
          <option value="SEP">SEP IRA</option>
          <option value="None">No retirement plans</option>
        </select>

        {/* New Question 9: Technology Investment */}
        <label htmlFor="tech-investment">
          Percentage of revenue invested in technology and digital
          transformation?
        </label>
        <select id="tech-investment">
          <option value="Low">Less than 2%</option>
          <option value="Medium">2% - 5%</option>
          <option value="High">5% - 10%</option>
          <option value="VeryHigh">More than 10%</option>
        </select>

        {/* New Question 10: Sustainability Initiatives */}
        <label htmlFor="sustainability">
          Do you have formal sustainability or ESG initiatives?
        </label>
        <select id="sustainability">
          <option value="Comprehensive">
            Comprehensive ESG strategy and reporting
          </option>
          <option value="Initial">Initial sustainability efforts</option>
          <option value="None">No formal sustainability initiatives</option>
        </select>

        <footer className="popup-footer">
          <button className="secondary-button">Cancel</button>
          <a className="button" href="/guide">
            Submit
          </a>
        </footer>
      </form>
    </Popup>
  );
}
