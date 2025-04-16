const Hero =({title,description})=>{
    return (
        <div className="bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                            <span className="text-black">{title}</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Hero;