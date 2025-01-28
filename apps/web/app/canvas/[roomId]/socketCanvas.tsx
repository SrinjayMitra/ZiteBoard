// export class Mycanvas extends Component<MycanvasProps, MycanvasState> {
//   private canvasRef: React.RefObject<HTMLCanvasElement>;
//   private ctx: CanvasRenderingContext2D | null = null;
//   private existingShapes: Shape[] = [];
//   private socket: WebSocket | null = null;
//   private currentRect: { startX: number; startY: number; width: number; height: number } | null =
//     null;

//   constructor(props: MycanvasProps) {
//     super(props);
//     this.state = {
//       isDrawing: false,
//       startX: 0,
//       startY: 0,
//       canvasCleared: false
//     };

//     this.canvasRef = props.canvas ? { current: props.canvas } : React.createRef();
//   }

//    componentDidMount() {
//     const canvas = this.canvasRef.current;
//     if (!canvas) {
//       console.error("Canvas not found");
//       return;
//     }

//     this.ctx = canvas.getContext("2d");
//     if (!this.ctx) {
//       console.error("Canvas context not found");
//       return;
//     }

//     this.setupCanvas();
//   }


//   setupCanvas = () => {
//     const canvas = this.canvasRef.current;
//     if (!canvas || !this.ctx) return;

//     const handleMouseDown = (e: MouseEvent) => {
//       this.setState({
//         isDrawing: true,
//         startX: e.offsetX,
//         startY: e.offsetY,
//       });
//       console.log("Mouse Down:", {
//         startX: e.offsetX,
//         startY: e.offsetY,
//       });
//       this.clearCanvas(this.existingShapes,this.canvasRef.current!,this.ctx!);
//     };

//     const handleMouseUp = () => {
//       this.setState({ isDrawing: false });
//       console.log("Mouse Up");
//       if (this.currentRect && this.props.type === "rect") {
//         const { startX, startY, width, height } = this.currentRect;
//         this.existingShapes.push({
//           type: "rect",
//           startX,
//           startY,
//           width,
//           height,
//         });
//     }
//     this.clearCanvas(this.existingShapes,this.canvasRef.current!,this.ctx!);
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       const { isDrawing, startX, startY,canvasCleared } = this.state;
//       if (!isDrawing) {
//         console.log("Mouse Move ignored because isDrawing is false");
//         return;
//       }
//       else if(isDrawing  && !canvasCleared ){
//         this.clearCanvas(this.existingShapes, this.canvasRef.current!, this.ctx!);
//         this.setState({ canvasCleared: true }); // Set flag to true after clearing
//       }
      
//       const currentX = e.offsetX;
//       const currentY = e.offsetY;

//       const width = Math.abs(currentX - startX);
//       const height = Math.abs(currentY - startY);

//       const rectStartX = currentX < startX ? currentX : startX;
//       const rectStartY = currentY < startY ? currentY : startY;

//       const EllipseWidth = Math.abs(currentX - startX) / 2;
//       const EllipseHeight = Math.abs(currentY - startY) / 2;

//       const EllipsecenterX = (currentX + startX) / 2;
//       const EllipsecenterY = (currentY + startY) / 2;
//       this.currentRect = { startX: rectStartX, startY: rectStartY, width, height };

//       if(this.ctx && this.canvasRef.current){
//       // rerendering the cavas evrytime drawing new shapes
//       this.clearCanvas(this.existingShapes, this.canvasRef.current!, this.ctx!); 
//       this.ctx.strokeStyle = "white";
//       let type = this.props.type ;
//       switch(type){
//             case "round-rect":
//               this.ctx.beginPath();
//               this.ctx.roundRect(rectStartX, rectStartY, width, height, 6 * Math.PI);
//               this.ctx.stroke();
//               break;

//             case "rect":
//                 this.ctx.beginPath();
//                 this.ctx.strokeRect(rectStartX, rectStartY, width, height);
//                 this.ctx.stroke();
//                 break;

//             case "diamond":
//                 this.ctx.save(); // Save the current state of the canvas
//                 this.ctx.translate(rectStartX + width / 2, rectStartY + height / 2); // Move to the center of the diamond
//                 this.ctx.rotate(45 * Math.PI / 180); // Rotate by 45 degrees (convert to radians)
//                 this.ctx.beginPath();
//                 this.ctx.roundRect(-width / 2, -height / 2, width, width,4*Math.PI);
//                 this.ctx.stroke(); // Draw the rotated rectangle
//                 this.ctx.restore();
//                 break;
                
//             case "arrow":
//                 this.ctx.beginPath();
//                 canvas_arrow(this.ctx, startX, startY, currentX, currentY, 10);
//                 this.ctx.stroke();  
//                 break;   
                
//             case "line":
//                 this.ctx.beginPath();
//                 canvas_arrow(this.ctx, startX, startY, currentX, currentY, 0);
//                 this.ctx.stroke();  
//                 break;   


//             case "circle":
//               this.ctx.beginPath();
//               this.ctx.ellipse(EllipsecenterX, EllipsecenterY, EllipseWidth, EllipseHeight, 0, 0, 2 * Math.PI);
//               this.ctx.stroke();
//               break;
          
//             case "text":
//               this.ctx.strokeRect(rectStartX, rectStartY, width, height);
//               this.ctx.fillStyle = "white";
//               this.ctx.fillText(this.props.text as unknown as string, startX, startY);
//               break;
          
//             default:
//               console.error("Unknown type:", this.props.type);
//               break;
//           }
//         }
//     };

//     // Attach events
//     canvas.addEventListener("mousedown", handleMouseDown);
//     canvas.addEventListener("mouseup", handleMouseUp);
//     canvas.addEventListener("mousemove", handleMouseMove);

//     // Cleanup
//     return () => {
//       canvas.removeEventListener("mousedown", handleMouseDown);
//       canvas.removeEventListener("mouseup", handleMouseUp);
//       canvas.removeEventListener("mousemove", handleMouseMove);
//     };
//   };

// clearCanvas = (existingShapes: Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D): void =>{
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//     // ctx.fillStyle = "black";
//     // ctx.fillRect(0,0,canvas.width,canvas.height);
//     existingShapes.map((shape)=>{
//         switch(shape.type){
//              case "rect":
//                    ctx.strokeRect(shape.startX! ,shape.startY! , shape.width!, shape.height!);
//              /// add more types here for more shapes      
//       }
//     })    
// }

//   render() {
//     if (this.props.canvas) {
//         return null; // Do not render a new canvas if an external one is provided
//       }
//     return (
//       <div>
//         <canvas
//           ref={this.canvasRef}
//           width={1000}
//           height={1000}
//           style={{ backgroundColor: "black" }}
//         />
//       </div>
//     );
//   }
// }
