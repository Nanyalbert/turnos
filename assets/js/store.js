(function(){
  const KEY='black_turnos_v1';
  const DAYS=['sun','mon','tue','wed','thu','fri','sat'];
  function isoLocal(d){const x=new Date(d);const y=x.getFullYear(),m=String(x.getMonth()+1).padStart(2,'0'),day=String(x.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
  function seed(){
    const now=new Date(); const plus=(n,h,m=0)=>{const d=new Date(now);d.setDate(d.getDate()+n);d.setHours(h,m,0,0);return {date:isoLocal(d),time:`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`}};
    const p1='pro_contactologia'; const p2='pro_optica';
    return {professionals:[
      {id:p1,name:'Contactóloga',specialty:'Contactología',slotDuration:30,active:true},
      {id:p2,name:'Black Óptica',specialty:'Atención óptica',slotDuration:30,active:true}
    ],availability:{
      [p1]:{mon:['09:00','18:00'],tue:['09:00','18:00'],wed:['09:00','18:00'],thu:['09:00','18:00'],fri:['09:00','18:00'],sat:['09:00','13:00']},
      [p2]:{mon:['09:00','19:00'],tue:['09:00','19:00'],wed:['09:00','19:00'],thu:['09:00','19:00'],fri:['09:00','19:00'],sat:['09:00','14:00']}
    },appointments:[
      {id:'a1',professionalId:p1,...plus(1,10,0),duration:30,patientName:'Paciente demo',phone:'3510000000',service:'Contactología',status:'confirmed',source:'internal',notes:''},
      {id:'a2',professionalId:p1,...plus(2,16,0),duration:30,patientName:'Reserva web demo',phone:'3510000001',service:'Control',status:'pending',source:'web',notes:''}
    ],blocks:[]};
  }
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||seed()}catch(e){return seed()}}
  function save(data){localStorage.setItem(KEY,JSON.stringify(data));return data}
  function uid(prefix){return prefix+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
  function toMinutes(t){const [h,m]=t.split(':').map(Number);return h*60+m}
  function fromMinutes(n){return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`}
  function slotsFor(proId,date){const data=load(),pro=data.professionals.find(p=>p.id===proId);if(!pro)return[];const day=DAYS[new Date(date+'T12:00:00').getDay()];const range=data.availability[proId]?.[day];if(!range)return[];const step=Number(pro.slotDuration)||30;const [start,end]=range.map(toMinutes);const slots=[];for(let t=start;t+step<=end;t+=step){const time=fromMinutes(t);const occupied=data.appointments.some(a=>a.professionalId===proId&&a.date===date&&a.time===time&&a.status!=='cancelled');const blocked=data.blocks.some(b=>b.professionalId===proId&&b.date===date&&toMinutes(b.start)<=t&&toMinutes(b.end)>t);if(!occupied&&!blocked)slots.push(time)}return slots}
  function createAppointment(input){const data=load();const clash=data.appointments.some(a=>a.professionalId===input.professionalId&&a.date===input.date&&a.time===input.time&&a.status!=='cancelled');if(clash)throw new Error('Ese horario acaba de ocuparse. Elegí otro.');const a={id:uid('apt'),status:'pending',source:'internal',notes:'',...input,duration:Number(input.duration)||30};data.appointments.push(a);save(data);return a}
  window.BlackTurnosStore={load,save,uid,slotsFor,createAppointment,isoLocal,DAYS};
})();
