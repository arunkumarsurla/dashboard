import { fetchSettings } from '@/services/settings'

// ─────────────────────────────────────────────────────────────
// Fallback company values
// ─────────────────────────────────────────────────────────────

const DEFAULTS = {
  company_name:    'AK Enterprises',
  company_tagline: 'Sales & Service',
  company_phone:   '9999999999',
  company_address: 'Visakhapatnam, Andhra Pradesh',
  company_email:   ''
}

async function getCompany() {
  try {
    const data = await fetchSettings()
    return {
      name:    data.company_name    || DEFAULTS.company_name,
      tagline: data.company_tagline || DEFAULTS.company_tagline,
      phone:   data.company_phone   || DEFAULTS.company_phone,
      address: data.company_address || DEFAULTS.company_address,
      email:   data.company_email   || DEFAULTS.company_email,
    }
  } catch {
    return {
      name:    DEFAULTS.company_name,
      tagline: DEFAULTS.company_tagline,
      phone:   DEFAULTS.company_phone,
      address: DEFAULTS.company_address,
      email:   DEFAULTS.company_email,
    }
  }
}

// Helper function to format date with time
function formatDateTime(date, includeTime = true) {
  if (!date) date = new Date()
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  
  if (includeTime) {
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }
  return `${day}/${month}/${year}`
}

// ─────────────────────────────────────────────────────────────
// Shared header / footer
// ─────────────────────────────────────────────────────────────

function buildHeader(doc, title, company) {
  const pw = doc.internal.pageSize.width
  doc.setFillColor(30, 58, 138)
  doc.rect(0, 0, pw, 50, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24); doc.setFont(undefined, 'bold')
  doc.text(company.name, pw / 2, 15, { align: 'center' })
  doc.setFontSize(10); doc.setFont(undefined, 'normal')
  doc.text(company.tagline, pw / 2, 24, { align: 'center' })
  doc.setFontSize(7.5)
  doc.text(company.address, pw / 2, 33, { align: 'center' })
  doc.setFontSize(9)
  doc.text(`Contact: ${company.phone}, ${company.email}`, pw / 2, 43, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(15); doc.setFont(undefined, 'bold')
  doc.text(title, pw / 2, 63, { align: 'center' })
  doc.setLineWidth(0.5); doc.line(20, 70, pw - 20, 70)
}

function buildFooter(doc, company) {
  const pw = doc.internal.pageSize.width
  doc.setLineWidth(0.5); doc.line(20, 260, pw - 20, 260)
  doc.setFontSize(9); doc.setFont(undefined, 'normal')
  doc.text(`Thank you for choosing ${company.name}!`, pw / 2, 270, { align: 'center' })
  doc.setFontSize(8)
  doc.text(`For support: Contact ${company.phone}, ${company.email}`, pw / 2, 277, { align: 'center' })
}

// ─────────────────────────────────────────────────────────────
// Service Invoice
// ─────────────────────────────────────────────────────────────

export async function generateServiceInvoice({ customer, serviceDate, savedData }) {
  const [{ jsPDF }, company] = await Promise.all([
    import('jspdf'),
    getCompany(),
  ])

  const doc = new jsPDF()
  const pw  = doc.internal.pageSize.width
  const now = new Date()

  buildHeader(doc, 'SERVICE RECEIPT', company)

  doc.setFontSize(9); doc.setFont(undefined, 'normal')
  const [y, m, d] = (serviceDate || now.toISOString().slice(0, 10)).split('-')
  const receiptTime = formatDateTime(now)
  const serviceDateTime = serviceDate ? formatDateTime(new Date(serviceDate)) : formatDateTime(now)
  
  doc.text(`Receipt ID: #${Date.now().toString().slice(-6)}`, 20, 78)
  doc.text(`Generated: ${receiptTime}`, pw - 20, 78, { align: 'right' })

  doc.setFontSize(11); doc.setFont(undefined, 'bold'); doc.text('CUSTOMER DETAILS:', 20, 93)
  doc.setFontSize(9); doc.setFont(undefined, 'normal')
  doc.text(`Name: ${customer.name}`, 20, 103)
  doc.text(`Phone: +91 ${customer.phone}`, 20, 111)
  if (customer.email) doc.text(`Email: ${customer.email}`, 20, 119)
  let yp = customer.email ? 127 : 119
  const addrLines = doc.splitTextToSize(`Address: ${customer.address}`, pw - 40)
  addrLines.forEach(l => { doc.text(l, 20, yp); yp += 7 })
  yp += 8

  doc.setFontSize(11); doc.setFont(undefined, 'bold'); doc.text('SERVICE DETAILS:', 20, yp)
  doc.setFontSize(9); doc.setFont(undefined, 'normal')
  doc.text(`Purifier Brand: ${customer.brand}`, 20, yp + 10)
  doc.text(`Plan Duration: ${savedData.reminderMonths || customer.service} Months`, 20, yp + 18)

  const sd = new Date(serviceDate || now)
  const ed = new Date(serviceDate || now)
  ed.setMonth(ed.getMonth() + parseInt(savedData.reminderMonths || customer.service || 0))
  
  doc.text(`Start Date & Time: ${formatDateTime(sd)}`, 20, yp + 26)
  doc.text(`End Date: ${formatDateTime(ed, false)}`, 20, yp + 34)
  yp += 48

  doc.setFillColor(240, 240, 240); doc.rect(20, yp, pw - 40, 24, 'F')
  doc.setFontSize(10); doc.setFont(undefined, 'bold')
  doc.text('PAYMENT DETAILS:', 25, yp + 10)
  doc.setFontSize(9); doc.setTextColor(0, 128, 0); doc.setFont(undefined, 'bold')
  doc.text(
    savedData.totalBill
      ? `Amount: Rs.${savedData.totalBill} (${savedData.paymentMode})`
      : 'Amount Paid: Service Activated',
    25, yp + 18
  )
  doc.setTextColor(0, 0, 0)

  buildFooter(doc, company)
  doc.save(`Invoice_${customer.name}_${Date.now()}.pdf`)
}

// ─────────────────────────────────────────────────────────────
// Custom Invoice
// ─────────────────────────────────────────────────────────────

export async function generateCustomInvoice(form) {
  const [{ jsPDF }, company] = await Promise.all([
    import('jspdf'),
    getCompany(),
  ])

  const doc = new jsPDF()
  const pw  = doc.internal.pageSize.width
  const now = new Date()

  buildHeader(doc, 'CUSTOM INVOICE', company)

  doc.setFontSize(9); doc.setFont(undefined, 'normal')
  doc.text(`Invoice ID: #${Date.now().toString().slice(-6)}`, 20, 78)
  doc.text(`Generated: ${formatDateTime(now)}`, pw - 20, 78, { align: 'right' })

  doc.setFontSize(11); doc.setFont(undefined, 'bold'); doc.text('CUSTOMER DETAILS:', 20, 93)
  doc.setFontSize(9); doc.setFont(undefined, 'normal')
  doc.text(`Name: ${form.name}`, 20, 103)
  doc.text(`Phone: +91 ${form.phone}`, 20, 111)
  if (form.email) doc.text(`Email: ${form.email}`, 20, 119)
  let y = form.email ? 127 : 119
  if (form.address) {
    const ls = doc.splitTextToSize(`Address: ${form.address}`, pw - 40)
    ls.forEach(l => { doc.text(l, 20, y); y += 7 })
  }
  y += 8

  doc.setFontSize(11); doc.setFont(undefined, 'bold'); doc.text('SERVICE DETAILS:', 20, y)
  doc.setFontSize(9); doc.setFont(undefined, 'normal')
  doc.text(`Purifier Brand: ${form.brand}`, 20, y + 10)
  doc.text(`Service Date & Time: ${formatDateTime(now)}`, 20, y + 18)
  y += 28

  doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text('SPARE PARTS:', 20, y)
  y += 8; doc.setFontSize(9); doc.setFont(undefined, 'normal')
  let cnt = 0
  Object.entries(form.spareParts).forEach(([p, used]) => {
    if (used) { cnt++; doc.text(`  ${cnt}. ${p}`, 25, y); y += 7 }
  })
  if (!cnt) { doc.text('  No parts replaced', 25, y); y += 7 }

  y += 5; doc.setFillColor(240, 240, 240); doc.rect(20, y, pw - 40, 24, 'F')
  doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text('PAYMENT DETAILS:', 25, y + 10)
  doc.setFontSize(9); doc.setTextColor(0, 128, 0); doc.setFont(undefined, 'bold')
  doc.text(
    form.amount ? `Amount: Rs.${form.amount} (${form.paymentMode})` : 'Service Activated',
    25, y + 18
  )

  if (form.notes) {
    y += 35; doc.setTextColor(0, 0, 0)
    doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text('NOTES:', 20, y)
    doc.setFontSize(9); doc.setFont(undefined, 'normal')
    const nl = doc.splitTextToSize(form.notes, pw - 40); y += 8
    nl.forEach(l => { doc.text(l, 20, y); y += 6 })
  }

  doc.setTextColor(0, 0, 0)
  buildFooter(doc, company)
  doc.save(`CustomInvoice_${form.name}_${Date.now()}.pdf`)
}